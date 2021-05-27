const axios = require('axios')

module.exports = async function (context, req) {
    const siteId = "c883736b-b8a6-4a02-8387-cf675a6a66ef"
    const apiKey = "e1d15419-0b6b-4672-b1bb-eb488ff996b3"

    const name = req.query.name
    const pageSize = req.query.pageSize
    const tags = req.query.tags ? req.query.tags.split(",") : []

    // make custom flowplayer request (using API v2)
    let response
    try {
        response = await axios.get(
            `https://api.flowplayer.com/ovp/web/video/v2/site/${siteId}.json?api_key=${apiKey}${name ? `&search=${name}` : ""}&page_size=${pageSize && !tags[0] ? pageSize : "200"}&published=true`
        )
    } catch(e) {
        return console.log(e)
    }
    const videos = response.data.videos

    // filter response data
    let filteredVideos = videos

    // return only films if no film_trailer tag present
    const trailerString = " Trailer"
    if (!tags[0] || !tags.some(tag => tag === "film_trailer")) filteredVideos = filteredVideos.filter(video => !video.name.includes(trailerString))

    // enter tag filtering land
    if (tags) {
        // tag query param present so filter is required
        filteredVideos = filteredVideos.filter(video => tags.every(tag => video.tags.includes(tag)))
        
        // pageSize isn't used in query with tags as it would reduce results before filtering by tags
        // therefore we slice the array here instead
        filteredVideos = filteredVideos.slice(0, pageSize)
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: filteredVideos
    }
}