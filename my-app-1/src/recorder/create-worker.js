const createWorker = func => {
    let workerString = func.toString()
    workerString = workerString.substr(workerString.indexOf('{') + 1)
    workerString = workerString.substr(0, workerString.lastIndexOf('}'))
    const workerBlob = new Blob([workerString])
    const workerURL = URL.createObjectURL(workerBlob)
    const worker = new Worker(workerURL)
    URL.revokeObjectURL(workerURL)
    return worker
  }
  
  export default createWorker