import { useRef, useState } from 'react';
export default function AddModal({ getPlaylists, user }) {
	const [toggled, setToggled] = useState(true);
	const nameRef = useRef(null);
	const descriptionRef = useRef(null);

	const createPlaylist = async () => {
		if (nameRef.current.value === '' || descriptionRef.current.value === '') {
			return;
		}
		const response = await fetch(
			`https://api.spotify.com/v1/users/${user.id}/playlists`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access-token'),
				},
				method: 'POST',
				body: JSON.stringify({
					name: nameRef.current.value,
					description: descriptionRef.current.value,
					public: toggled,
				}),
			}
		);
		const string = await response.text();
		const json = string === '' ? {} : JSON.parse(string);
		console.log('post test', json);
		getPlaylists(user);
	};
	return (
		<div>
			<input
				type='checkbox'
				id='my-modal'
				className='modal-toggle'
			/>
			<div className='modal'>
				<div className='modal-box text-center'>
					<h2>Create Playlist</h2>
					<input
						ref={nameRef}
						type='text'
						placeholder='Name...'
						className='input input-bordered w-full max-w-xs mt-2'
					/>
					<input
						ref={descriptionRef}
						type='text'
						placeholder='Description...'
						className='input input-bordered w-full max-w-xs mt-2'
					/>
					<div className='form-control w-52 mx-auto'>
						<div className='cursor-pointer'>
							<span className='label-text'>Private Playlist</span>
							<input
								onChange={() => setToggled(!toggled)}
								type='checkbox'
								className='checkbox'
							/>
						</div>
					</div>
					<div className='flex justify-center mt-2 gap-2'>
						<label
							onClick={createPlaylist}
							htmlFor='my-modal'
							className='btn'
						>
							Save
						</label>
						<label
							htmlFor='my-modal'
							className='btn'
						>
							Cancel
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
