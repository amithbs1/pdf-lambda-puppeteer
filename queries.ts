import { gql } from "@apollo/client/core"

export const FIND_TREATMENT_OPTIONS = gql`query getSelectedTreatmentOptions($optionId: String) {
  treatmentOptions(where: {id: $optionId}) {
    id
    optionState
    doctorNotes
    users_permissions_user {
      id
    	createdAt
    	updatedAt
    	username
    	phone
    	display_name
    	email
    	provider
    	confirmed
    	blocked
    }
  }
}`;

export const GET_HTML_TEMPLATE = gql`query getHTMLTemplate {
  treatmentToolMaster {
    age
    downloadTemplate
    uiSelector
    possibleTreatmentOptions
    preferenceScores
  }
}`;

export const FIND_USER_STRING = `query FetchSingleUser($email: String) {
  users(where: { email: $email }) {
    id
    createdAt
    updatedAt
    username
    phone
    display_name
    email
    provider
    confirmed
    blocked
    treatment_options {
      id
      doctorNotes
      optionState
      users_permissions_user {
        display_name
        email
        phone
      }
    }
  }
}`;

export const FIND_ME_STRING = `query {
  me {
    id
    email
    role {
      type
      name
    }
    user {
      id
      createdAt
      updatedAt
      username
      phone
      display_name
      email
      provider
      confirmed
      blocked
      treatment_options {
        id
        doctorNotes
        optionState
        users_permissions_user {
          display_name
          email
          phone
        }
      }
    }
  }
}`;

export const GET_ARTICLES_BY_SLUGS = gql`query getArticlesBySlug($riskRatificationArticle: String, $psaArticle: String, $watchfulWaitingArticle: String, $surgeryArticle: String, $hormoneTherapyArticle: String, $radiationTherapyArticle: String, $focalTherapyArticle: String, $multiModalityTherapyArticle: String) {
  articles(where: { _or: [{ slug: $riskRatificationArticle }, { slug: $psaArticle }, { slug: $watchfulWaitingArticle },{ slug: $surgeryArticle }, { slug: $hormoneTherapyArticle }, { slug: $radiationTherapyArticle },{ slug: $focalTherapyArticle }, { slug: $multiModalityTherapyArticle }] }) {
    name
    slug
    long_desc
    prev_article {
      name
      slug
      cover_image {
        url
      }
    }
    next_article {
      name
      slug
      cover_image {
        url
      }
    }
    sub_category {
      name
      category {
        name
      }
    }
  }
}
`;

export const GET_CATEGORIES = gql`
  query getCategories {
    categories {
      name
      href
      sub_categories {
        name
        isUIVisible
        article {
          slug
          short_desc
          cover_image {
            url
          }
        }
        href
      }
    }
  }
`;

export const GET_ALL_ARTICLES_NEW = gql`
  query getAllArticles {
    articles {
      name
      slug
      long_desc
      short_desc
      cover_image {
        url
      }
    }
  }
`;
