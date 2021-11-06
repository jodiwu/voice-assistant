# -*- coding:utf-8 -*-
#
#   author: iflytek
#
#  The third-party libraries and their versions information has shown below when it run success, 
#  and you can install them one by one or copy them to a new TXT file with PIP at one time:
#   cffi==1.12.3
#   gevent==1.4.0
#   greenlet==0.4.15
#   pycparser==2.19
#   six==1.12.0
#   websocket==0.2.1
#   websocket-client==0.56.0
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
import websocket
import datetime
import hashlib
import base64
import hmac
import json
from urllib.parse import urlencode
import time
import ssl
from wsgiref.handlers import format_date_time
from datetime import datetime
from time import mktime
import _thread as thread

STATUS_FIRST_FRAME = 0  # The identity of the first frame
STATUS_CONTINUE_FRAME = 1  # Intermediate frame identification
STATUS_LAST_FRAME = 2  # The identity of the last frame


class Ws_Param(object):
    # Initializing
    def __init__(self, APPID, APIKey, APISecret, AudioFile):
        self.APPID = APPID
        self.APIKey = APIKey
        self.APISecret = APISecret
        self.AudioFile = AudioFile

        self.CommonArgs = {"app_id": self.APPID}

        self.BusinessArgs = {"domain": "iat", "language": "ja_jp", "accent": "mandarin", "vinfo":1,"vad_eos":10000}
        # "language": Languages can be added trial or purchase in the console
    # 生成url
    def create_url(self):
        url = 'wss://iat-api-sg.xf-yun.com/v2/iat'
        # Generating a timestamp in RFC1123 format
        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))

        # Combining Strings
        signature_origin = "host: " + "iat-api-sg.xf-yun.com" + "\n"
        signature_origin += "date: " + date + "\n"
        signature_origin += "GET " + "/v2/iat " + "HTTP/1.1"
        # Hmac-sha256 is used for encryption
        signature_sha = hmac.new(self.APISecret.encode('utf-8'), signature_origin.encode('utf-8'),
                                 digestmod=hashlib.sha256).digest()
        signature_sha = base64.b64encode(signature_sha).decode(encoding='utf-8')

        authorization_origin = "api_key=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"" % (
            self.APIKey, "hmac-sha256", "host date request-line", signature_sha)
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')
        # Combines the request of authentication parameters into a dictionary
        v = {
            "authorization": authorization,
            "date": date,
            "host": "iat-api-sg.xf-yun.com"
        }
        # Concatenate the authentication parameters and generate the URL
        url = url + '?' + urlencode(v)
        # print("date: ",date)
        # print("v: ",v)
        # print('websocket url :', url)
        return url


# the websocket message has been received and handling
def on_message(ws, message):
    try:
        code = json.loads(message)["code"]
        sid = json.loads(message)["sid"]
        if code != 0:
            errMsg = json.loads(message)["message"]
            print("sid:%s call error:%s code is:%s" % (sid, errMsg, code))

        else:
            data = json.loads(message)["data"]["result"]["ws"]
            # print(json.loads(message))
            result = ""
            for i in data:
                for w in i["cw"]:
                    result += w["w"]
            print("sid:%s call success!,data is:%s" % (sid, json.dumps(data, ensure_ascii=False)))
    except Exception as e:
        print("receive msg,but parse exception:", e)



# the error websocket message has been received and handling
def on_error(ws, error):
    print("### error:", error)


# the closed websocket message has been received and handling
def on_close(ws):
    print("### closed ###")


# The connecting websocket message has been received and handling 
def on_open(ws):
    def run(*args):
        frameSize = 8000  # The audio size of each frame
        intervel = 0.04  # Send audio intervals (unit: S)
        status = STATUS_FIRST_FRAME  # The status information of the audio, identifying whether the audio is the first one, Intermediate one, or last frame

        with open(wsParam.AudioFile, "rb") as fp:
            while True:
                buf = fp.read(frameSize)
                if not buf:
                    status = STATUS_LAST_FRAME
                #  the first frame
                if status == STATUS_FIRST_FRAME:
                    # The first frame must be sent
                    d = {"common": wsParam.CommonArgs,
                         "business": wsParam.BusinessArgs,
                         "data": {"status": 0, "format": "audio/L16;rate=16000",
                                  "audio": str(base64.b64encode(buf), 'utf-8'),
                                  "encoding": "raw"}}
                    d = json.dumps(d)
                    ws.send(d)
                    status = STATUS_CONTINUE_FRAME
                # Intermediate frame
                elif status == STATUS_CONTINUE_FRAME:
                    d = {"data": {"status": 1, "format": "audio/L16;rate=16000",
                                  "audio": str(base64.b64encode(buf), 'utf-8'),
                                  "encoding": "raw"}}
                    ws.send(json.dumps(d))
                # the last frame
                elif status == STATUS_LAST_FRAME:
                    d = {"data": {"status": 2, "format": "audio/L16;rate=16000",
                                  "audio": str(base64.b64encode(buf), 'utf-8'),
                                  "encoding": "raw"}}
                    ws.send(json.dumps(d))
                    time.sleep(1)
                    break
                # Analog audio sampling delay
                time.sleep(intervel)
        ws.close()

    thread.start_new_thread(run, ())


if __name__ == "__main__":
    time1 = datetime.now()
    # Access from the Console to find ASR webapi 
    wsParam = Ws_Param(APPID='g9c0a6d5', APIKey='474a8a7f0b333903e40b33505052f14a',
                       APISecret='9408d43cde1959965dab66552eecf8dc',
                       AudioFile=r'ja.pcm') # Please fill in the audio file path
    websocket.enableTrace(False)
    wsUrl = wsParam.create_url()
    ws = websocket.WebSocketApp(wsUrl, on_message=on_message, on_error=on_error, on_close=on_close)
    ws.on_open = on_open
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
    time2 = datetime.now()
    print(time2-time1)
