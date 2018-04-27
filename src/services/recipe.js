import wepy from 'wepy';

import { TagFragment } from './tag';
import { UserFragment } from './user';

// fragment
export const RecipeFragment = `fragment RecipeFragment on Recipe {
  id
  name
  time
  desc
  avatar
  tags {
    ...TagFragment
  }
  creator {
    ...UserFragment
  }
} ${TagFragment} ${UserFragment}`;

export function recipes() {
  const query = `query recipes {
    recipes{
      ...RecipeFragment
    }
  } ${RecipeFragment}`

  const variables = {}

  return wepy.request({
    data: {
      query,
      variables
    },
    type: 'query'
  }).then(res => !res.data.data ? null : res.data.data.recipes)
}

export function recipe(id) {
  const query = `query recipe($id: ID!) {
    recipe(id: $id){
      ...RecipeFragment
    }
  } ${RecipeFragment}`

  const variables = { id }

  return wepy.request({
    data: {
      query,
      variables
    },
    type: 'query'
  }).then(res => !res.data.data ? null : res.data.data.recipe)
}

export function createRecipe(recipe, tagsMeta) {
  const mutation = `mutation createRecipe($recipe: CreateRecipeInput!, $tagsMeta: TagsMetaInput) {
    createRecipe(recipe: $recipe, tagsMeta: $tagsMeta) {
      ...RecipeFragment
    }
  } ${RecipeFragment}`

  const variables = { recipe, tagsMeta }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation'
  }).then(res => !res.data.data ? null : res.data.data.createRecipe)
}

export function updateRecipe(recipe, tagsMeta) {
  const mutation = `mutation updateRecipe($recipe: UpdateRecipeInput!, $tagsMeta: TagsMetaInput) {
    updateRecipe(recipe: $recipe, tagsMeta: $tagsMeta) {
      ...RecipeFragment
    }
  } ${RecipeFragment}`

  const variables = { recipe, tagsMeta }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation'
  }).then(res => !res.data.data ? null : res.data.data.updateRecipe)
}

export function deleteRecipe(id) {
  const mutation = `mutation deleteRecipe($id: ID!) {
    deleteRecipe(id: $id) {
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
  }).then(res => !res.data.data ? null : res.data.data.deleteRecipe)
}

export function uploadRecipePicture(id, data) {
  const recipe = {
    id,
    avatar: data.imgKey
  }

  return updateRecipe(recipe)
}
