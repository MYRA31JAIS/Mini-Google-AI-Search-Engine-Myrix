// Mock knowledge graph service - Replace with Neo4j in production
export const knowledgeGraphService = {
  getGraph: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const mainNode = { id: 'main', label: query, type: 'main' }
    const relatedNodes = [
      { id: 'related1', label: `${query} Basics`, type: 'concept' },
      { id: 'related2', label: `${query} Applications`, type: 'concept' },
      { id: 'related3', label: `${query} Research`, type: 'concept' },
      { id: 'related4', label: 'Related Field', type: 'field' }
    ]

    const links = [
      { source: 'main', target: 'related1', relation: 'includes' },
      { source: 'main', target: 'related2', relation: 'uses' },
      { source: 'main', target: 'related3', relation: 'studied_in' },
      { source: 'related1', target: 'related4', relation: 'connects_to' }
    ]

    return {
      nodes: [mainNode, ...relatedNodes],
      links
    }
  }
}
