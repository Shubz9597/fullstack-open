const dummy = (blogs) => {
	console.log(blogs)
	return 1
}

const totalLikes = (blogs) => {
	return blogs.length === 0 ? 0 : blogs.reduce((sum, order) => sum + order.likes, 0)
}


const favoriteBlog = (blogs) => {
	return blogs.length === 0 ? {} :
		blogs.reduce((max, order) => {
			return order.likes > max.likes ?  order : max
		}, { likes : Number.MIN_SAFE_INTEGER })
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}
