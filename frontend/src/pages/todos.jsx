import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function Todos(){

  const modalRef = useRef();

  const toggleNewTodoModal = () => {

    
    if (modalRef.current.open) {

      
      modalRef.current.close();

    } else {

      
      modalRef.current.showModal();
    }
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const handleNewTodo = (values) => {
    console.log(values);
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
              <button type="button" className="btn btn-ghost">
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    )
  }

  return (
    <>
      <NewTodoButton />
      <TodoModal />
    </>
  )
}
