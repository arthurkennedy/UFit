import profile from "../assets/profile.jpg"
import entryService from "../services/entry.jsx"
import {useEffect, useState} from "react"
import DisplayPost from "./DisplayPost.jsx"

const PostList = () => {

	const [posts, setPosts] = useState([])

	useEffect(() => {
		const fetchPosts = async () => {
			const loggedUserJSON = window.localStorage.getItem('loggedUser')
			const token = JSON.parse(loggedUserJSON).token
			const fetchedPosts = await entryService.getFeed(token)
			setPosts(fetchedPosts)
		}

		fetchPosts()
	}, [])

	console.log(posts)

	return (<div className="feedContainer">
			{posts.map((post) => <div key={post._id} className="feedBox">
				<div className="author">
					<div className="profileImage" style={{
						backgroundImage: `url(${profile})`
					}}>
					</div>
					{post.user.username}
				</div>
				<div className="post">
					<div>
						<DisplayPost content={post.content}/>
					</div>
				</div>
			</div>)}

		</div>)
}

export default PostList
