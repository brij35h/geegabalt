class Pending {
  constructor() {
    this.holdPendingTaskList = [];
  }

  updatePendingTaskInMemory(updateTaskList) {
    localStorage.setItem("pendingTask", JSON.stringify(updateTaskList));
  }

  setPendingTaskInMemory(pendingTaskList) {
    this.getPendingTaskFromMemory()
      ? this.holdPendingTaskList.push(...this.getPendingTaskFromMemory())
      : [];
    this.holdPendingTaskList.push(...pendingTaskList);
    localStorage.setItem(
      "pendingTask",
      JSON.stringify(this.holdPendingTaskList)
    );
    this.holdPendingTaskList = [];
  }

  getPendingTaskFromMemory() {
    const getPendingTask = JSON.parse(localStorage.getItem("pendingTask"));
    if (getPendingTask) {
      return getPendingTask;
    }
  }

  getPendingTaskLength() {
    if (this.getPendingTaskFromMemory()) {
      return this.getPendingTaskFromMemory().length;
    }
    return 0;
  }
}

const pending = new Pending();
export default pending;
