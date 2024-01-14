class Trash {
  constructor() {
    this.holdTrashTaskList = [];
  }

  setTrashTaskInMemory(trashTaskList) {
    this.getTrashTaskFromMemory()
      ? this.holdTrashTaskList.push(...this.getTrashTaskFromMemory())
      : [];
    this.holdTrashTaskList.push(trashTaskList);
    localStorage.setItem("trashTask", JSON.stringify(this.holdTrashTaskList));
    this.holdTrashTaskList = [];
  }

  getTrashTaskFromMemory() {
    const getTrashTask = JSON.parse(localStorage.getItem("trashTask"));
    if (getTrashTask) {
      return getTrashTask;
    }
  }

  getTrashTaskLength() {
    if (this.getTrashTaskFromMemory()) {
      return this.getTrashTaskFromMemory().length;
    }
    return 0;
  }
}

const trash = new Trash();
export default trash;
