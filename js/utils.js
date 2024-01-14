class Utils {
  constructor() {}

  sizeOfTrashTaskMemory(tasksMemory) {
    let sizeOfTask = 0;
    for (let x in tasksMemory) {
        sizeOfTask +=
        tasksMemory[x].taskName.length +
        tasksMemory[x].taskCaption.length +
        tasksMemory[x].taskPublishTime.length;
    }
    return `${parseFloat((sizeOfTask/1.7)/1024).toFixed(2)}KB / 5.00MB`
  }

  getCurrentLocalTime() {
    return new Date().toLocaleDateString();
  }

}

const utils = new Utils();
export default utils;
