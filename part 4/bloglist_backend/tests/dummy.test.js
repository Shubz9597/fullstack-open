const listHelper = require('../utils/list_helper').dummy

test('dummy return 1', () => {
	const blogs = []

	expect(listHelper(blogs)).toBe(1)
})