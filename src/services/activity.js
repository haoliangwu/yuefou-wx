import wepy from 'wepy';
import gql from 'graphql-tag';
import { TaskFragment } from './task';
import { RecipeFragment } from './recipe';
import { safePluckQueryResult } from './utils';

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
  createdAt
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
  }).then(safePluckQueryResult('activities'))
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
  }).then(safePluckQueryResult('activity'))
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
  }).then(safePluckQueryResult('createActivity'))
}

export function updateActivity(activity, tasksMeta, recipesMeta) {
  const mutation = `mutation updateActivity($activity: UpdateActivityInput!, $tasksMeta: TasksMetaInput, $recipesMeta: RecipesMetaInput) {
    updateActivity(activity: $activity, tasksMeta: $tasksMeta, recipesMeta: $recipesMeta) {
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
  }).then(safePluckQueryResult('updateActivity'))
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
  }).then(safePluckQueryResult('attendActivity'))
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
  }).then(safePluckQueryResult('deleteActivity'))
}
