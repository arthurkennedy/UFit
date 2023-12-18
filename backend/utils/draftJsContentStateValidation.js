const isValidDraftJsContent = (contentState) => {
	try {
		const content = JSON.parse(contentState)

		// Check if the primary properties 'blocks' and 'entityMap' exist
		if (!content.blocks || !Array.isArray(content.blocks) || !content.entityMap) {
			return false
		}
		for (const block of content.blocks) {
			// Check for required block properties
			if (typeof block.key !== 'string' ||
				typeof block.text !== 'string' ||
				typeof block.type !== 'string' ||
				typeof block.depth !== 'number' ||
				!Array.isArray(block.inlineStyleRanges) ||
				!Array.isArray(block.entityRanges) ||
				!(block.data instanceof Object)) {
				return false
			}
		}
		return true
	} catch (e) {
		return false
	}
}

module.exports = { isValidDraftJsContent }