const dummy = (blogs) => {
	console.log(blogs)
	return 1
}

const totalLikes = (blogs) => {
	return blogs.length === 0 ? 0 : blogs.reduce((sum, order) => sum + order.likes, 0)
}

module.exports = {
	dummy,
	totalLikes
}
