import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Todo = () => {
  const token = localStorage.getItem("token");

  const [todoInput, setTodoInput] = useState("");
  const [todo, setTodo] = useState([]);
  const navigator = useNavigate();
  useEffect(() => {
    if (!token) {
      navigator("/signin");
    }
    getTodos();
  }, []);

  const onChangeTodoInput = (e) => {
    const userInput = e.target.value;
    setTodoInput(userInput);
  };

  const onClickCreateTodo = () => {
    const url = "https://pre-onboarding-selection-task.shop/todos";
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: todoInput }),
    };
    fetch(url, config)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        getTodos();
        setTodoInput("");
      });
  };
  const getTodos = () => {
    const url = "https://pre-onboarding-selection-task.shop/todos";
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(url, config)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.error) setTodo(data);
      });
  };
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (isDeleted) {
      getTodos();
      setIsDeleted(false);
    }
  }, [isDeleted]);
  const onClickDeleteBtn = (id) => {
    const url = `https://pre-onboarding-selection-task.shop/todos/${id}`;

    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(url, config).then((res) => {
      setIsDeleted(true);
    });
  };
  const [isCompleted, setIsCompleted] = useState(false);

  const onClickSubmit = (id) => {
    const url = `https://pre-onboarding-selection-task.shop/todos/${id}`;

    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: editData.input,
        isCompleted: isCompleted,
      }),
    };
    fetch(url, config).then((res) => {
      setEditData({ ...editData, isEditMode: false });
      getTodos();
    });
  };
  const isChecked = (e) => {
    setIsCompleted(e.target.checked);
  };

  const [editData, setEditData] = useState({
    editId: 0,
    isEditMode: false,
    input: "",
  });

  const onChangeEditInput = (e) => {
    setEditData({ ...editData, input: e.target.value });
  };
  const onClickEdit = (todo) => {
    setEditData({
      ...editData,
      editId: todo.id,
      input: todo.todo,
      isEditMode: true,
    });
  };
  const onClickCancel = () => {
    setEditData({ ...editData, isEditMode: false });
  };
  return (
    <>
      <input
        onChange={onChangeTodoInput}
        type="text"
        data-testid="new-todo-input"
        value={todoInput}
        onKeyDown={(e) => {
          if (e.code === "Enter" && e.nativeEvent.isComposing === true) {
            onClickCreateTodo();
          }
        }}
      />
      <button onClick={onClickCreateTodo} data-testid="new-todo-add-button">
        추가
      </button>
      {!editData.isEditMode
        ? todo.map((todo) => {
            if (todo.id > 0) {
              return (
                <li key={todo.id}>
                  <label>
                    <input
                      onChange={isChecked}
                      type="checkbox"
                      defaultChecked={todo.isCompleted}
                    />
                    <span>{todo.todo}</span>
                    <button
                      onClick={() => onClickEdit(todo)}
                      data-testid="modify-button"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onClickDeleteBtn(todo.id)}
                      data-testid="delete-button"
                    >
                      삭제
                    </button>
                  </label>
                </li>
              );
            }
          })
        : todo.map((todo) => {
            return (
              <li key={todo.id}>
                <label>
                  {editData.editId === todo.id ? (
                    <>
                      <input type="checkbox" onChange={isChecked} />
                      <input
                        onChange={onChangeEditInput}
                        type="text"
                        defaultValue={todo.todo}
                      />
                      <button
                        onClick={() => onClickSubmit(todo.id)}
                        data-testid="submit-button"
                      >
                        제출
                      </button>
                      <button
                        onClick={onClickCancel}
                        data-testid="cancel-button"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        defaultChecked={todo.isCompleted}
                        onChange={() => isChecked(todo.id)}
                      />
                      <span>{todo.todo}</span>
                      <button
                        onClick={() => onClickEdit(todo)}
                        data-testid="modify-button"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onClickDeleteBtn(todo.id)}
                        data-testid="delete-button"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </label>
              </li>
            );
          })}
    </>
  );
};
export default Todo;
