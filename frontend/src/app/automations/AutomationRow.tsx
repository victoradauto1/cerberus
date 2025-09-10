"use client";

import {
  deleteAutomation,
  startAutomation,
  stopAutomation,
} from "@/services/AutomationService";
import Automation from "commons/models/automation";
import { useRouter } from "next/navigation";

type Props = {
  data: Automation;
  onUpdate: Function;
};

function AutomationRow(props: Props) {
  const { push } = useRouter();

  function getPositionClass(automation: Automation) {
    return automation.isOpened ? "text-emerald-500" : "text-red-500";
  }

  function getPositionText(automation: Automation) {
    return automation.isOpened ? "RED TO SELL" : "RED TO BUY";
  }

  function getActiveClass(automation: Automation) {
    return automation.isOpened ? "text-emerald-500" : "text-red-500";
  }

  function getActiveText(automation: Automation) {
    return automation.isOpened ? "RUNNING" : "STOPPED";
  }

  function btnStartClick() {
    startAutomation(props.data.id!)
      .then((automation) => {
        alert(`Automation started succefully!`);

        props.onUpdate();
      })
      .catch((err) =>
        alert(err.response ? JSON.stringify(err.response.data) : err.message)
      );
  }

  function btnStopClick() {
    stopAutomation(props.data.id!)
      .then((automation) => {
        alert(`Automation stopped succefully!`);

        props.onUpdate();
      })
      .catch((err) =>
        alert(err.response ? JSON.stringify(err.response.data) : err.message)
      );
  }

  function btnDeleteClick() {
    if (!confirm("This operation is irreversible. Are you sure?")) return;
    deleteAutomation(props.data.id!)
      .then((automation) => {
        alert(`Automation deleted succefully!`);

        props.onUpdate();
      })
      .catch((err) =>
        alert(err.response ? JSON.stringify(err.response.data) : err.message)
      );
  }

  function btnEditClick() {
    push("/automations/new/?id=" + props.data.id);
  }

  return (
    <tr>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        {props.data.name}
      </td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        <i className={`fas fa-circle ${getPositionClass(props.data)} mr-2`}></i>{" "}
        {getPositionText(props.data)}
      </td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        <i className={`fas fa-circle ${getActiveClass(props.data)} mr-2`}></i>{" "}
        {getActiveText(props.data)}
      </td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        {props.data.isActive ? (
          <>
            <button
              type="button"
              onClick={btnStopClick}
              className="fas fa-stop mr-3"
            >
              <i />
            </button>
            <button
              type="button"
              onClick={btnEditClick}
              className="fas fa-pencil mr-3"
            >
              <i />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={btnStartClick}
              className="fas fa-play mr-3"
            >
              <i />
            </button>

            <button
              type="button"
              onClick={btnEditClick}
              className="fas fa-pencil mr-3"
            >
              <i />
            </button>

            <button
              type="button"
              onClick={btnDeleteClick}
              className="fas fa-trash mr-3"
            >
              <i />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default AutomationRow;
