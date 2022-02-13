import React, { useEffect, useState } from "react";

export const TodoList = () => {
	const [inputTask, setInputTask] = useState("");
	const [taskList, setTaskList] = useState([]); // SetTaskList changes value of tasklist
	const uri = "https://assets.breatheco.de/apis/fake/todos/user/yadisa";

	useEffect(() => {
		getFetch();
	}, []);

	const getFetch = () => {
		fetch(uri)
			.then(function (response) {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then(function (responseAsJson) {
				console.log("responseAsJson", responseAsJson);
				setTaskList(responseAsJson);
			})
			.catch(function (error) {
				console.log("error", error);
			});
	};
	const updatePut = (updatedTodos) => {
		fetch(uri, {
			method: "PUT",
			body: JSON.stringify(updatedTodos),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((response) => {
				console.log("success", response);
				getFetch();
			})
			.catch((error) => console.error("error", error));
	};

	const saveTask = (e) => {
		let newTodos = taskList.concat({
			label: inputTask,
			done: false,
		});

		if (e.keyCode == 13) {
			setTaskList(newTodos);
			updatePut(newTodos);
			setInputTask(""); // this is clearing out the input text field after enter
		}
	};

	const removeTask = (index) => {
		const newTodos = taskList.filter((tasktToRemove, i) => i != index);

		setTaskList(newTodos);
		updatePut(newTodos);
	};

	const markDone = (index) => {
		const newTodos = taskList.map((task, i) => {
			if (i == index) {
				task.done = !task.done;
				return task;
			} else {
				return task;
			}
		});

		setTaskList(newTodos);
		updatePut(newTodos);
	};

	return (
		<div className="todo-box">
			<h1>todos</h1>
			<input
				className="center-block"
				type="text"
				onChange={(e) => setInputTask(e.target.value)} // this saves the info user input
				value={inputTask} ////////////////////////////// this displays/onlys shows whats typed in input (currently) from the user in variable
				onKeyUp={(e) => saveTask(e)} // passing e(onkeyupevent) to the function saveTask
				//onChange={onChange} if used function above to call
			/>
			<ul>
				{taskList.map((task, index) => {
					// map function passes a function inisde of it (always pass item 1st then index)
					return (
						<li className="list" key={index}>
							{" "}
							<span className={task.done ? "strike" : ""}>
								{task.label}
							</span>
							<span
								className="delete-icon"
								onClick={() => removeTask(index)}>
								{" "}
								{/*all we care about is the index to remove task not the event itself. we are not trying to save any value by the onclick*/}
								<i className="fas fa-trash"></i>
							</span>
							<span
								onClick={() => markDone(index)}
								className={task.done ? "green" : ""}>
								{" "}
								{/*all we care about is the index to remove task not the event itself. we are not trying to save any value by the onclick*/}
								<i className="fas fa-check-square"></i>
							</span>
						</li>
					);
				})}
			</ul>
			<div className="task-counter">
				<em>
					{taskList.length == 0
						? "no tasks"
						: `${taskList.length} tasks `}
				</em>
			</div>
		</div>
	);
};
