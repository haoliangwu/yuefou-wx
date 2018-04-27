import wepy from 'wepy';
import gql from 'graphql-tag';
import { TaskFragment } from './task';
import { RecipeFragment } from './recipe';

// fragment
export const ActivityFragment = `fragment ActivityFragment on Activity {
  id
  title
  desc
  status
  type
  location
  startedAt
  endedAt
  creator {
    id
    name
  }
  participants {
    id
    name
  }
  tasks {
    ...TaskFragment
  }
  recipes {
    ...RecipeFragment
  }
} ${TaskFragment} ${RecipeFragment}
`;

export function activities() {
  const query = `query activities {
    activities {
      ...ActivityFragment
    }
  } ${ActivityFragment}`

  const variables = {}

  return wepy.request({
    data: {
      query,
      variables
    },
    type: 'query'
  }).then(res => !res.data.data ? null : res.data.data.activities)
}

export function activity(id) {
  const query = `query activity($id: ID!){
    activity(id: $id) {
      ...ActivityFragment
    }
  } ${ActivityFragment}`

  const variables = { id }

  return wepy.request({
    data: {
      query,
      variables
    },
    type: 'query'
  }).then(res => !res.data.data ? null : res.data.data.activity)
}

export function createActivity(activity, tasksMeta, recipesMeta) {
  const mutation = `mutation createActivity($activity: CreateActivityInput!, $tasksMeta: TasksMetaInput, $recipesMeta: RecipesMetaInput) {
    createActivity(activity: $activity, tasksMeta: $tasksMeta, recipesMeta: $recipesMeta) {
      ...ActivityFragment
    }
  } ${ActivityFragment}`

  const variables = {
    activity,
    tasksMeta,
    recipesMeta
  }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation'
  }).then(res => !res.data.data ? null : res.data.data.createActivity)
}

export function attend(id) {
  const mutation = `mutation attendActivity($id: ID!) {
    attendActivity(id: $id) {
      ...ActivityFragment
    }
  } ${ActivityFragment}`

  const variables = { id }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation'
  }).then(res => !res.data.data ? null : res.data.data.attendActivity)
}

export function deleteActivity(id) {
  const mutation = `mutation deleteActivity($id: ID!) {
    deleteActivity(id: $id) {
      id
    }
  }`

  const variables = { id }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation'
  }).then(res => !res.data.data ? null : res.data.data.deleteActivity)
}
