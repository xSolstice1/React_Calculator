import "./styles.css"
import NumberButton from "./NumberButton"
import OperandButton from "./OperandButton"
import {useReducer} from "react";

export const ACTION = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  RESULT: 'result',
  RANDOM: 'random'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes('.')) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
      case ACTION.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }

        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation
          }
        }

        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }

        return {
          ...state,
          previousOperand: result(state),
          currentOperand: null,
          operation: payload.operation
        }
      case ACTION.CLEAR:
        return {};

      case ACTION.RESULT:
        if (
          state.currentOperand == null ||
          state.previousOperand == null ||
          state.operation == null
        ) {
          return state;
        }
        else {
          return {
            ...state,
            overwrite: true,
            previousOperand: null,
            operation: null,
            currentOperand: result(state),
          }
        }

      default:
        break
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function format(operand) {
  if (operand == null) {
    return
  }

  const [integer,decimal] = operand.split('.');
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function result({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) {
    return "";
  }
  let evaluation = "";
  switch (operation) {
    case "+":
      evaluation = prev + current;
      break;
    case "-":
      evaluation = prev - current;
      break;
    case "/":
      evaluation = prev / current;
      break;
    case "x":
      evaluation = prev * current;
      break;
    case "%":
      evaluation = prev % current;
      break;
    default:
      break;
  }

  return evaluation.toString();
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer,
    {})

  return (
  <div className="grid">
    <div className="output">
      <div className="previous-operand">{previousOperand} {operation}</div>
      <div className="current-operand">{format(currentOperand)}</div>
    </div>
    <button className="span-two" onClick={() => dispatch({type: ACTION.CLEAR})}>AC</button>
    <button onClick={()=> dispatch({type: ACTION.DELETE_DIGIT})}>DEL</button>
    <OperandButton operation="/" dispatch={dispatch} />
    <NumberButton digit="1" dispatch={dispatch} />
    <NumberButton digit="2" dispatch={dispatch} />
    <NumberButton digit="3" dispatch={dispatch} />
    <OperandButton operation="x" dispatch={dispatch} />
    <NumberButton digit="4" dispatch={dispatch} />
    <NumberButton digit="5" dispatch={dispatch} />
    <NumberButton digit="6" dispatch={dispatch} />
    <OperandButton operation="-" dispatch={dispatch} />
    <NumberButton digit="7" dispatch={dispatch} />
    <NumberButton digit="8" dispatch={dispatch} />
    <NumberButton digit="9" dispatch={dispatch} />
    <OperandButton operation="+" dispatch={dispatch} />
    <NumberButton digit="." dispatch={dispatch} />
    <NumberButton digit="0" dispatch={dispatch} />
    <button className="span-two" onClick={() => dispatch({type: ACTION.RESULT})}>=</button>
    <OperandButton operation="%" dispatch={dispatch} />
    <button className="span-three"></button>
  </div>
  )
}

export default App;
