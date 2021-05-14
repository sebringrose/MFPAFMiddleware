const axios = require('axios')

module.exports = async function (context, req) {
    const siteId = "c883736b-b8a6-4a02-8387-cf675a6a66ef"
    const apiKey = "e1d15419-0b6b-4672-b1bb-eb488ff996b3"

    const response = await axios.get(`https://api.flowplayer.com/ovp/web/video/v2/site/${siteId}.json?api_key=${apiKey}&page_size=200&published=true`)
    
    const videos = response.data.videos
    const name = req.query.name
    const duration = req.query.duration
    const tags = req.query.tags ? req.query.tags.split(",") : false
    let filteredVideos

    if (name) {
        // name provided - return specific video
        filteredVideos = videos.filter(video => video.name === name)
    } else {
        filteredVideos = duration || tags 
            // duration or tag query params present so filters are required
            ? videos.filter(video => duration && tags 
                // if we need to filter for duration AND tags
                ? video.duration < duration && tags.every(tag => video.tags.includes(tag)) 
                // if we need to filter for duration OR tags
                : (duration && video.duration < duration) || (tags && tags.every(tag => video.tags.includes(tag)))) 
            // no query params to filter by so return all videos
            : videos
    }
     

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: filteredVideos
    }
}