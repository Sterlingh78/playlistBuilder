import { useRef, useState } from 'react';
export default function AddModal({ getPlaylists, user }) {
	const nameRef = useRef(null);
	const descriptionRef = useRef(null);

	const createPlaylist = async () => {
		if (nameRef.current.value === '' || descriptionRef.current.value === '') {
			return;
		}
		try {
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
						public: false,
					}),
				}
			);
			const string = await response.text();
			const json = string === '' ? {} : JSON.parse(string);
			console.log('post test', json);
			getPlaylists(user);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div>
			<input
				type='checkbox'
				id='my-modal'
				className='modal-toggle'
			/>
			<div className='modal'>
				<div className='modal-box text-center bg-base-100'>
					<h2 className='text-3xl text-[hsl(var(--p))] mb-2'>
						Create Playlist
					</h2>
					<input
						ref={nameRef}
						type='text'
						placeholder='Name'
						className='input input-bordered w-full max-w-xs mt-2'
					/>
					<textarea
						ref={descriptionRef}
						className='textarea textarea-bordered w-full max-w-xs mt-2'
						placeholder='Description'
					></textarea>
					<div className='flex justify-center mt-4 gap-2'>
						<label
							onClick={createPlaylist}
							htmlFor='my-modal'
							className='btn btn-primary btn-outline'
						>
							Save
						</label>
						<label
							htmlFor='my-modal'
							className='btn btn-primary btn-outline'
						>
							Cancel
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
