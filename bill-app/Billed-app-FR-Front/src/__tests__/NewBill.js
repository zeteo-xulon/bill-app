/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event"
import router from "../app/Router.js";

// Mock store
jest.mock("../app/store", () => ({ ...mockStore, bills: jest.fn(mockStore.bills) }) );

describe("Given I am connected as an employee", () => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock })
  window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
  const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })  }

  describe("When I submit a new Bill", () => {

    describe("And I submit the form with correct values", () => {
      test("Then must save the bill", () => {
        // DOM element creation
        document.body.innerHTML = NewBillUI()
    
        const copyNewBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
        const newBillForm = screen.getByTestId("form-new-bill")
        const handleSubmit = jest.fn((e) => copyNewBill.handleSubmit(e));

        // Listener and action
        newBillForm.addEventListener("submit", handleSubmit);
        fireEvent.submit(newBillForm);

        // assert
        expect(newBillForm).toBeTruthy()
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    describe("And I submit the form with incorrect values", () => {
      test("Then must not save the bill", () => {
        // DOM element creation
        document.body.innerHTML = NewBillUI()
    
        const copyNewBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
        const newBillForm = screen.getByTestId("form-new-bill")
        const handleSubmit = jest.fn((e) => copyNewBill.handleSubmit(e));

        // Listener and action
        newBillForm.addEventListener("submit", handleSubmit);
        fireEvent.submit(newBillForm);

        // assert
        expect(newBillForm).toBeTruthy()
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    describe("And I add a file", () => {
      test("Then submit the form with the correct file without issue",() => {
        // DOM creation
        document.body.innerHTML = NewBillUI()

        // Mock NewBill
        const copyNewBill = new NewBill({
          document, 
          onNavigate, 
          store: mockStore, 
          localStorage: window.localStorage
        })

        // Mock file
        const file = new File(['image'], 'image.png', {type: 'image/png'});
        const handleChangeFile = jest.fn((e) => copyNewBill.handleChangeFile(e));
        const newBillForm = screen.getByTestId("form-new-bill")
        const newBillFile = screen.getByTestId('file');

        newBillFile.addEventListener("change", handleChangeFile);     
        userEvent.upload(newBillFile, file)

        const handleSubmit = jest.fn((e) => copyNewBill.handleSubmit(e));
        newBillForm.addEventListener("submit", handleSubmit);     
        fireEvent.submit(newBillForm);

        // assert
        expect(newBillFile.files[0].name).toBeDefined()
        expect(handleChangeFile).toBeCalled()
        expect(handleSubmit).toHaveBeenCalled();
      })

      test("Then submit the form with an incorrect format file to receive an error",() => {
        // DOM creation
        document.body.innerHTML = NewBillUI()

        // Mock alert
        const originalWindowAlert = { ...window.alert };
        window.alert = jest.fn();

        // Mock NewBill
        const copyNewBill = new NewBill({
          document, 
          onNavigate, 
          store: mockStore, 
          localStorage: window.localStorage
        })

        // Mock file
        const file = new File(['gif'], 'image.gif', {type: 'image/gif'});
        const handleChangeFile = jest.fn((e) => copyNewBill.handleChangeFile(e));
        const newBillForm = screen.getByTestId("form-new-bill")
        const newBillFile = screen.getByTestId('file');

        newBillFile.addEventListener("change", handleChangeFile);     
        userEvent.upload(newBillFile, file)

        const handleSubmit = jest.fn((e) => copyNewBill.handleSubmit(e));
        newBillForm.addEventListener("submit", handleSubmit);     
        fireEvent.submit(newBillForm);

        // assert
        expect(window.alert).toHaveBeenCalledWith("Le format de l'image n'est pas valide");
        window.alert = originalWindowAlert;

      })
    })
  })
  
})