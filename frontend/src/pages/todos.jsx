import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import getAxiosClient from "../axios-instance";

export default function Todos(){

  const modalRef = useRef();
  const queryClient = useQueryClient();

  const { mutate: createNewTodo } = useMutation({
	  // The key used to identify this mutation in React Query's cache
	  mutationKey: ["newTodo"],
	
	  // The function that performs the mutation (i.e., creating a new to-do)
	  mutationFn: async (newTodo) => {
	    const axiosInstance = await getAxiosClient();
	
	    // Use the Axios instance to make a POST request to the server, sending the new to-do data
	    const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);
	
	    // Return the response data (e.g., the newly created to-do object)
	    return data;
	  },
  });

  const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
    mutationFn: async (todoId) => {
    const axiosInstance = await getAxiosClient(); 

      const { data } = await axiosInstance.put(`http://localhost:8080/todos/${todoId}/completed`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    }
  });

  const { data, isError, isLoading } = useQuery({
    // A unique key to identify this query in React Query's cache
    queryKey: ["todos"],

    // The function responsible for fetching the data
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();

      // Use the Axios instance to send a GET request to fetch the list of todos
      const { data } = await axiosInstance.get("http://localhost:8080/todos");

      // Return the fetched data (React Query will cache it under the queryKey)
      return data;
    },
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });


  const toggleNewTodoModal = () => {
    
    if (modalRef.current.open) {

      modalRef.current.close();

    } else {

      modalRef.current.showModal();
    }
  }


  const handleNewTodo = (values) => {
    createNewTodo(values);
    toggleNewTodoModal();
  }

  const NewTodoButton = () => {
    return (
      <button className="btn btn-primary" onClick={() => toggleNewTodoModal()}>
        New Todo
      </button>
    )
  }

  const TodoModal = () => {
    return (
     <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          <form onSubmit={handleSubmit(handleNewTodo)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("name")}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("description")}
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create Todo
              </button>
              <button type="button" onClick={toggleNewTodoModal} className="btn btn-ghost">
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    )
  }

  const TodoItemList = () => {
    return (
      <div className="w-lg h-sm flex column items-center justify-center gap-4">
        {data.success && data.todos && data.todos.length >= 1 ? 
        (
          <ul className="flex column items-center justify-center gap-4">
            {
              data.todos.map(todo => (
                <li key={todo.id} className="inline-flex items-center gap-4">
                  <div className="w-md">
                    <h3 className="text-lg">
                      {todo.name}
                    </h3>
                    <p className="text-sm">{todo.description}</p>
                  </div>
                  <div className="w-md">
                    <label className="swap">
                      <input type="checkbox" onClick={() => markAsCompleted(todo.id)} />
                      <div className="swap-on">
                        Yes
                      </div>
                      <div className="swap-off">
                        No
                      </div>
                    </label>
                  </div>
                </li>
              ))
            }
          </ul>
        ) 
        : 
        (
          <p>There are no todos yet.</p>
        )
        }
      </div>
    )
  }

  if(isLoading){
    return (
      <div>Loading Todos...</div>
    )
  }
  
  if(isError){
    return (
      <div>There was an error</div>
    )
  }

  return (
    <>
      <NewTodoButton />
      <TodoItemList />
      <TodoModal />
    </>
  )
}



/*
  const TodoItemList = () => {
    return (
      <div className="w-lg h-sm flex column items-center justify-center gap-4">
        {data.success && data.todos && data.todos.length >= 1 ? 
        (
          <ul className="flex column items-center justify-center gap-4">
            {
              data.todos.map(todo => (
                <li className="inline-flex items-center gap-4">
                  <div className="w-md">
                    <h3 className="text-lg">
                      {todo.name}
                    </h3>
                    <p className="text-sm">{todo.description}</p>
                  </div>
                  <div className="w-md">
                    <label className="swap">
                      <input type="checkbox" onClick={() => markAsCompleted(todo.id)} />
                      <div className="swap-on">
                        Yes
                      </div>
                      <div className="swap-off">
                        No
                      </div>
                    </label>
                  </div>
                </li>
              ))
            }
          </ul>
        ) 
        : 
        (
          <p>There are no todos yet.</p>
        )
        }
      </div>
    )
  }
*/