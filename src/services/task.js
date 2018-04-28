import wepy from 'wepy';
import { safePluckQueryResult } from './utils';

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
  }).then(safePluckQueryResult('tasks'))
}

export function createTask(activityId, task) {
  const mutation = `mutation createTask($id: ID!, $task: CreateTaskInput!) {
    createTask(task: $task, id: $id) {
      ...TaskFragment
    }
  } ${TaskFragment}`

  const variables = {
    id: activityId,
    task
  }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation'
  }).then(safePluckQueryResult('updateTaskStatus'))
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
  }).then(safePluckQueryResult('updateTaskStatus'))
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
  }).then(safePluckQueryResult('assignTask'))
}
