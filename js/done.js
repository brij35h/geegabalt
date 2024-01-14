class Done {
  constructor() {
    this.holdDoneTaskList = [];
  }

  setDoneTaskInMemory(doneTaskList) {
    if (this.getDoneTaskFromMemory()) {
      this.holdDoneTaskList.push(...this.getDoneTaskFromMemory());
    }
    this.holdDoneTaskList.push(doneTaskList);
    localStorage.setItem("doneTask", JSON.stringify(this.holdDoneTaskList));
    this.holdDoneTaskList = [];
  }

  getDoneTaskFromMemory() {
    const getDoneTask = JSON.parse(localStorage.getItem("doneTask"));
    if(getDoneTask){
        return getDoneTask
    }

  }

  getDoneTaskLength() {
    if (this.getDoneTaskFromMemory()) {
      return this.getDoneTaskFromMemory().length;
    }
    return 0;
  }
}

const done = new Done();
export default done;
