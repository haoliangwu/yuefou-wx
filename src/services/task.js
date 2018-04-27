import wepy from 'wepy';

// fragment
export const TaskFragment = `fragment TaskFragment on ActivityTask {
  id
  name
  status
  assignee {
    id
    name
  }
  activity {
    id
    title
    participants {
      id
      name
    }
    creator {
      id
      name
    }
  }
}`;

export function tasks() {
  const query = `query tasks {
    tasks {
      ...TaskFragment
    }
  } ${TaskFragment}`

  const variables = {}

  return wepy.request({
    data: {
      query,
      variables
    },
    type: 'query'
  }).then(res => !res.data.data ? null : res.data.data.tasks)
}

export function updateTaskStatus(activityId, taskId, status) {
  const mutation = `mutation updateTaskStatus($id: ID!, $taskId: ID!, $status: ProcessStatus!){
    updateTaskStatus(id: $id, taskId: $taskId, status: $status) {
      ...TaskFragment
    }
  } ${TaskFragment}`

  const variables = {
    id: activityId,
    taskId,
    status
  }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation'
  }).then(res => !res.data.data ? null : res.data.data.updateTaskStatus)
}

export function assignTask(activityId, taskId, assigneeId) {
  const mutation = `mutation assignTask($id: ID!, $taskId: ID!, $assigneeId: ID!) {
    assignTask(id: $id, taskId: $taskId, assigneeId: $assigneeId) {
      ...TaskFragment
    }
  } ${TaskFragment}`

  const variables = {
    id: activityId,
    taskId,
    assigneeId
  }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation'
  }).then(res => !res.data.data ? null : res.data.data.assignTask)
}
