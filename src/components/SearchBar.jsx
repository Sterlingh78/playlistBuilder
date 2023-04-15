export default function SearchBar({}) {
	return (
		<div className='navbar bg-base-100'>
			<div className='mx-auto flex flex-col'>
				<div>
					<a className='btn btn-ghost normal-case text-xl'>daisyUI</a>
				</div>

				<input
					type='text'
					placeholder='Search'
					className='input input-bordered input-sm w-full'
				/>

				<div className='mt-2 gap-2 flex flex-row'>
					<button className='btn btn-primary btn-sm'>Artist</button>
					<button className='btn btn-primary btn-sm'>Album</button>
					<button className='btn btn-primary btn-sm'>Song</button>
					<button className='btn btn-primary btn-sm'>Audiobook</button>
				</div>
			</div>
		</div>
	);
}
