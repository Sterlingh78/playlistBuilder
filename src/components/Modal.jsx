import { useRef } from 'react';
export default function Modal({ currentPlaylist }) {
	const nameRef = useRef(null);
	const descriptionRef = useRef(null);
	const toggleRef = useRef(null);
	const handleEdit = async () => {
		let name;
		let description;
		let privateToggle;

		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${currentPlaylist.id}`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access-token'),
				},
			}
		);
		const data = await response.json();
		return data;
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
					<h2>Playlist Edit</h2>
					<input
						type='text'
						placeholder='Name...'
						className='input input-bordered w-full max-w-xs mt-2'
					/>
					<input
						type='text'
						placeholder='Description...'
						className='input input-bordered w-full max-w-xs mt-2'
					/>
					<div className='form-control w-52 mx-auto'>
						<div className='cursor-pointer'>
							<span className='label-text'>Private Playlist</span>
							<input
								type='checkbox'
								className='ml-2 mt-2 toggle toggle-secondary'
							/>
						</div>
					</div>
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
