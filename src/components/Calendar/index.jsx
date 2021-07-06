import React, { useState, useEffect } from 'react';
import { withAuthentication } from '../Session';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';

import CalendarBody from './calendar-body';
import CalendarHead from './calendar-head';

import AddActivity from '../AddActivity';
import ActivityList from '../ActivityList';
import EditActivity from '../EditActivity';

function Calendar(props) {
	const { firebase, authUser } = props;
	let defaultSelectedDay = {
		day: moment().format('D'),
		month: moment().month(),
	};

	/*** HOOKS ***/
	const [dateObject, setdateObject] = useState(moment());
	const [showMonthTable, setShowMonthTable] = useState(false);
	const [selectedDay, setSelected] = useState(defaultSelectedDay);

	const allMonths = moment.months();
	const currentMonth = () => dateObject.format('MMMM');
	const currentYear = () => dateObject.format('YYYY');

	const setMonth = (month) => {
		let monthNo = allMonths.indexOf(month);
		let newDateObject = Object.assign({}, dateObject);
		newDateObject = moment(dateObject).set('month', monthNo);
		setdateObject(newDateObject);
		setShowMonthTable(false);
	};

	const toggleMonthSelect = () => setShowMonthTable(!showMonthTable);

	const setSelectedDay = (day) => {
		setSelected({
			day,
			month: currentMonthNum(),
		});
		// Later refresh data
	};

	const currentMonthNum = () => dateObject.month();
	const daysInMonth = () => dateObject.daysInMonth();
	const currentDay = () => dateObject.format('D');
	const actualMonth = () => moment().format('MMMM');

	const firstDayOfMonth = () => moment(dateObject).startOf('month').format('d');

	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMsg, setSnackbarMsg] = React.useState(null);

	const [activities, setActivities] = useState(true);
	const [loading, setLoading] = useState([]);
	const [activeDays, setActiveDays] = useState([]);

	const retrieveData = () => {
		let queryDate = `${selectedDay.day}-${selectedDay.month}-${selectedDay.year}`;

		let ref = firebase.db.ref().child(`users/${authUser.uid}/activities`);
		ref
			.orderByChild('date')
			.equalTo(queryDate)
			.on('value', (snapshot) => {
				let data = snapshot.val();
				setActivities(data);
				setLoading(false);
			});

		retrieveActiveDays();
	};

	const retrieveActiveDays = () => {
		let ref = firebase.db.ref().child(`users/${authUser.uid}/activities`);
		ref.on('value', (snapshot) => {
			let data = snapshot.val();
			if (data !== null) {
				const values = Object.values(data);
				// Store all active day/month combinations in array for calendar
				const arr = values.map((obj) => {
					return obj.date.length === 8
						? obj.date.slice(0, 3)
						: obj.date.slice(0, 4);
				});
				setActiveDays(arr);
			} else {
				setActiveDays([]);
			}
		});
	};

	useEffect(() => {
		retrieveData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDay]);

	const [editing, setEditing] = useState(false);
	const [activity, setActivity] = useState(null);
	const [activityKey, setActivityKey] = useState(null);

	const editActivity = (activity, i) => {
		setActivityKey(Object.keys(activities)[i]);
		setEditing(true);
		setActivity(activity);
	};

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={8} lg={9}>
				<CalendarHead
					allMonths={allMonths}
					currentMonth={currentMonth}
					currentYear={currentYear}
					setMonth={setMonth}
					showMonthTable={showMonthTable}
					toggleMonthSelect={toggleMonthSelect}
				/>
				<CalendarBody
					firstDayOfMonth={firstDayOfMonth}
					daysInMonth={daysInMonth}
					currentDay={currentDay}
					currentMonth={currentMonth}
					currentMonthNum={currentMonthNum}
					actualMonth={actualMonth}
					setSelectedDay={setSelectedDay}
					selectedDay={selectedDay}
					weekdays={moment.weekdays()}
					activeDays={activeDays}
				/>
			</Grid>

			<Grid item xs={12} md={4} lg={3}>
				<Paper className='paper'>
					{editing ? (
						<>
							<h3>
								Edit activity on {selectedDay.day}-{selectedDay.month + 1}{' '}
							</h3>
							<EditActivity
								activity={activity}
								activityKey={activityKey}
								selectedDay={selectedDay}
								authUser={props.authUser}
								setEditing={setEditing}
								setOpenSnackbar={setOpenSnackbar}
								setSnackbarMsg={setSnackbarMsg}
							/>
						</>
					) : (
						<>
							<h3>
								Add activity on {selectedDay.day}-{selectedDay.month + 1}{' '}
							</h3>
							<AddActivity
								selectedDay={selectedDay}
								authUser={props.authUser}
								setOpenSnackbar={setOpenSnackbar}
								setSnackbarMsg={setSnackbarMsg}
							/>
						</>
					)}
				</Paper>
			</Grid>
			<Grid item xs={12} md={7}>
				<Paper className='paper'>
					<h3>
						Activities on {selectedDay.day}-{selectedDay.month + 1}
					</h3>
					<ActivityList
						firebase={firebase}
						loading={loading}
						activity={activity}
						activities={activities}
						authUser={props.authUser}
						setOpenSnackbar={setOpenSnackbar}
						setSnackbarMsg={setSnackbarMsg}
						editActivity={editActivity}
						setEditing={setEditing}
					/>
				</Paper>
			</Grid>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				open={openSnackbar}
				message={snackbarMsg}
			/>
		</Grid>
	);
}

export default withAuthentication(Calendar);
