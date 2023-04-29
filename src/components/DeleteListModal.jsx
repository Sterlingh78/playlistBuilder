export default function DeleteListModal({
	listIdx,
	playlistName,
	handleUnfollow,
}) {
	return (
		<div>
			<input
				type='checkbox'
				id='unfollow-modal'
				className='modal-toggle'
			/>
			<div className='modal'>
				<div className='modal-box text-center'>
					<h2>Are you sure you want to unfollow {playlistName}?</h2>
					<div className='flex justify-center mt-2 gap-2'>
						<label
							onClick={() => handleUnfollow(listIdx)}
							htmlFor='unfollow-modal'
							className='btn'
						>
							Unfollow
						</label>
						<label
							htmlFor='unfollow-modal'
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
