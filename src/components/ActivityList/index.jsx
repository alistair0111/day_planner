import React, { useEffect } from 'react';
import { withFirebase } from '../Firebase';
import loader from './loader.gif';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';

function ActivityList(props) {
	const {
		loading,
		activities,
		editActivity,
		setOpenSnackbar,
		setSnackbarMsg,
		setEditing,
	} = props;
	// const defaultActivity = {
	// 	name: activity.name,
	// 	type: activity.type,
	// 	duration: activity.duration,
	// 	date: activity.date,
	// 	done: activity.done,
	// };

	const deleteActivity = (i) => {
		// Get key of activity in firebase
		const activityKey = Object.keys(activities)[i];
		// Connect to our firebase API
		const emptyActivity = {
			date: null,
			duration: null,
			type: null,
			name: null,
			done: null,
		};

		props.firebase.updateActivity(
			props.authUser.uid,
			emptyActivity,
			activityKey
		);

		// Show notification
		setOpenSnackbar(true);
		setSnackbarMsg('Deleted activity');
		setTimeout(() => {
			setOpenSnackbar(false);
		}, 3000);

		// stop editing
		setEditing(false);
	};

	const [status, setStatus] = React.useState('def');

	// const [newActivity, setNewActivity] = useState(defaultActivity);

	const handleStatus = (index, activity) => (e) => {
		let updateStatus = {
			name: activity.name,
			type: activity.type,
			duration: activity.duration,
			date: activity.date,
			done: e.target.checked,
		};

		props.firebase.updateActivity(
			props.authUser.uid,
			updateStatus,
			Object.keys(activities)[index]
		);
		setStatus([
			...status.slice(0, index),
			e.target.checked,
			...status.slice(index + 1),
		]);
		setOpenSnackbar(true);
		setSnackbarMsg('Updated Activity Status');
		setTimeout(() => {
			setOpenSnackbar(false);
		}, 3000);
	};

	useEffect(() => {
		let statusValues = [];

		activities === 'not set' || activities === null
			? console.log('Empty day')
			: Object.values(activities).map((activity, i) => {
					let { done } = activity;
					statusValues.push(done);
					return done;
			  });
		setStatus(statusValues);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading]);

	return (
		<>
			{loading === true ? <img src={loader} alt={loader}></img> : ''}

			{activities === 'not set' || activities === null ? (
				<p>Your Day looks Empty.</p>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Duration</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.values(activities).map((activity, i) => {
								let { name, type, duration } = activity;
								switch (activity.type) {
									case 1:
										type = 'Productivity';
										break;
									case 2:
										type = 'Leisure';
										break;
									case 3:
										type = 'Exercise';
										break;
									default:
										type = 'Not set';
								}
								return (
									<TableRow key={i}>
										<TableCell>{name}</TableCell>
										<TableCell>{type}</TableCell>
										<TableCell>{duration}</TableCell>
										<TableCell>
											<Checkbox
												checked={status[i] ? true : false}
												onChange={handleStatus(i, activity)}
												name='checked'
											/>
										</TableCell>
										<TableCell>
											<DeleteIcon onClick={(e) => deleteActivity(i)} />
											<EditIcon
												onClick={(e) => editActivity(activity, i)}
												style={{ marginLeft: '20px' }}
											/>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
}

export default withFirebase(ActivityList);
