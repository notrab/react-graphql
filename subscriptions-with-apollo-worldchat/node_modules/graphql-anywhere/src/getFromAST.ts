import {
  DocumentNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
} from 'graphql';

export function getMutationDefinition(doc: DocumentNode): OperationDefinitionNode {
  checkDocument(doc);

  let mutationDef: OperationDefinitionNode = null;
  doc.definitions.forEach((definition) => {
    if (definition.kind === 'OperationDefinition'
        && (definition as OperationDefinitionNode).operation === 'mutation') {
      mutationDef = definition as OperationDefinitionNode;
    }
  });

  if (!mutationDef) {
    throw new Error('Must contain a mutation definition.');
  }

  return mutationDef;
}

// Checks the document for errors and throws an exception if there is an error.
export function checkDocument(doc: DocumentNode) {
  if (doc.kind !== 'Document') {
    throw new Error(`Expecting a parsed GraphQL document. Perhaps you need to wrap the query \
string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql`);
  }

  const numOpDefinitions = doc.definitions.filter((definition) => {
    return definition.kind === 'OperationDefinition';
  }).length;

  // can't have more than one operation definition per query
  if (numOpDefinitions > 1) {
    throw new Error('Queries must have exactly one operation definition.');
  }
}

export function getOperationName(doc: DocumentNode): string {
  let res: string = '';
  doc.definitions.forEach((definition) => {
    if (definition.kind === 'OperationDefinition'
        && (definition as OperationDefinitionNode).name) {
      res = (definition as OperationDefinitionNode).name.value;
    }
  });
  return res;
}

// Returns the FragmentDefinitions from a particular document as an array
export function getFragmentDefinitions(doc: DocumentNode): FragmentDefinitionNode[] {
  let fragmentDefinitions: FragmentDefinitionNode[] = doc.definitions.filter((definition) => {
    if (definition.kind === 'FragmentDefinition') {
      return true;
    } else {
      return false;
    }
  }) as FragmentDefinitionNode[];

  return fragmentDefinitions;
}

export function getQueryDefinition(doc: DocumentNode): OperationDefinitionNode {
  checkDocument(doc);

  let queryDef: OperationDefinitionNode = null;
  doc.definitions.map((definition) => {
    if (definition.kind === 'OperationDefinition'
       && (definition as OperationDefinitionNode).operation === 'query') {
      queryDef = definition as OperationDefinitionNode;
    }
  });

  if (!queryDef) {
    throw new Error('Must contain a query definition.');
  }

  return queryDef;
}

export function getFragmentDefinition(doc: DocumentNode): FragmentDefinitionNode {
  if (doc.kind !== 'Document') {
    throw new Error(`Expecting a parsed GraphQL document. Perhaps you need to wrap the query \
string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql`);
  }

  if (doc.definitions.length > 1) {
    throw new Error('Fragment must have exactly one definition.');
  }

  const fragmentDef = doc.definitions[0] as FragmentDefinitionNode;

  if (fragmentDef.kind !== 'FragmentDefinition') {
    throw new Error('Must be a fragment definition.');
  }

  return fragmentDef as FragmentDefinitionNode;
}

export interface FragmentMap {
  [fragmentName: string]: FragmentDefinitionNode;
}

// Utility function that takes a list of fragment definitions and makes a hash out of them
// that maps the name of the fragment to the fragment definition.
export function createFragmentMap(fragments: FragmentDefinitionNode[] = []): FragmentMap {
  const symTable: FragmentMap = {};
  fragments.forEach((fragment) => {
    symTable[fragment.name.value] = fragment;
  });

  return symTable;
}

// Utility function that takes a list of fragment definitions and adds them to a particular
// document.
export function addFragmentsToDocument(queryDoc: DocumentNode,
  fragments: FragmentDefinitionNode[]): DocumentNode {
  checkDocument(queryDoc);
  return {
    ...queryDoc,
    definitions: queryDoc.definitions.concat(fragments),
  } as DocumentNode;
}

export function getMainDefinition(queryDoc: DocumentNode): OperationDefinitionNode | FragmentDefinitionNode {
  checkDocument(queryDoc);

  try {
    return getQueryDefinition(queryDoc);
  } catch (e) {
    try {
      return getMutationDefinition(queryDoc);
    } catch (e) {
      try {
        const fragments = getFragmentDefinitions(queryDoc);

        return fragments[0];
      } catch (e) {
        throw new Error(`Expected a parsed GraphQL query with a query, mutation, or a fragment.`);
      }
    }
  }
}
