import Queue from "better-queue"
import { write } from "."
import mapper from "mybatis-mapper"

// Bulk Data insert
const mainQueue = new Queue(function (task, cb) {
  syncData(task, cb)
  }, { 
    batchSize: 200,
    batchDelay: 3000,
    maxTimeout: 5000,
  }
);

async function syncData(task: any, cb: Queue.ProcessFunctionCb<any>) {
  let bulkMap = new Map<string, any>()
  const sep = "+"
  for await (const data of task) {
    const key = data.namespace + sep + data.sql
    if(bulkMap.has(key)) {
      const bulkArr = bulkMap.get(key)
      bulkArr.push(data.params)
    } else {
      const newArr: any[] = [data.params]
      bulkMap.set(key, newArr)
    }
  }

  for await (let [key, value] of bulkMap) {
    const xmlInfo = key.split(sep);
    mapper.createMapper([ 'query/' + xmlInfo[0] + '.xml' ]);
    const query = mapper.getStatement(xmlInfo[0], xmlInfo[1], {bulk: value});
    // console.log('queue', query)
    try {
      await write(query)
    }
    catch(ex) {
      console.log(ex)
    }
  }

  cb()
}

export default mainQueue

