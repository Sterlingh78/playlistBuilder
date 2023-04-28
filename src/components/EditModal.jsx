import { useRef, useState } from 'react';
export default function EditModal({
	currentPlaylist,
	handlePlaylist,
	showAlert,
}) {
	const nameRef = useRef(null);
	const descriptionRef = useRef(null);
	const handleEdit = async () => {
		let name =
			nameRef.current.value === ''
				? currentPlaylist.name
				: nameRef.current.value;
		let desc =
			descriptionRef.current.value === ''
				? currentPlaylist.description
				: descriptionRef.current.value;
		try {
			const response = await fetch(
				`https://api.spotify.com/v1/playlists/${currentPlaylist.id}`,
				{
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('access-token'),
					},
					method: 'PUT',
					body: JSON.stringify({
						name: name,
						description: desc,
					}),
				}
			);
			const string = await response.text();
			const json = string === '' ? {} : JSON.parse(string);
			console.log('put test', json);
			handlePlaylist(currentPlaylist.id);
			showAlert('success', 'Playlist Saved!');
			return json;
		} catch (err) {
			console.log(err);
		}
	};
	//console.log('toggle test', toggled);
	return (
		<div>
			<input
				type='checkbox'
				id='my-modal'
				className='modal-toggle'
			/>
			<div className='modal'>
				<div className='modal-box text-center'>
					<h2>Playlist Edit</h2>
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
					<div className='flex justify-center mt-2 gap-2'>
						<label
							htmlFor='my-modal'
							className='btn'
							onClick={handleEdit}
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
