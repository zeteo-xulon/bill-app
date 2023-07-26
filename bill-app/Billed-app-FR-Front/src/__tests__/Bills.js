/**
 * @jest-environment jsdom
 */

import {screen} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import { modal } from "../views/DashboardFormUI.js";
import { formatDate } from "../app/format.js";
import mockedBills from "../__mocks__/store.js";

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}


describe("Given I am connected as an employee", () => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }) );

  describe("When I am on Bills Page", () => {
    test('Then the loading screen should appear', () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })

    test('Then it Should render the error page', () => {
      document.body.innerHTML = BillsUI({ error: 'could not access the server' })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })

    test("Then bill icon in vertical layout should be highlighted", async () => {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const windowIcon = await screen.getAllByTestId('icon-window');
      expect(windowIcon).toBeTruthy()
    })
  })


  describe("When I am on the Bills page but it is empty", () => {
    test("Then it should render 'No bill yet'", () => {
      document.body.innerHTML = BillsUI({ data: [] })
      expect(screen.getAllByText("Aucune note de frais n'a été enregistrée")).toBeTruthy()
    })
  })


  describe("When I am on Bills page and I click on the new bill button", () => {
    test("Then it should render NewBill page", () => {
      // DOM element creation
      document.body.innerHTML = BillsUI({ data: [] })

      // init Bills container
      const billsContainer = new Bills({ 
        document, 
        onNavigate, 
        firestore: null, 
        localStorage: window.localStorage 
      })

      // click on new bill button Event
      const handleClickNewBill = jest.fn(billsContainer.handleClickNewBill())
      const newBillBtn = screen.getByText('Envoyer une note de frais');
      newBillBtn.addEventListener('click', handleClickNewBill);
      userEvent.click(newBillBtn);

      // Assert
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
  })


  describe("When I am on Bills page and I click on the icon eye", () => {
    test('handleClickIconEyeCopie should display the bill image in a modal', () => {
      // Mock modal Jquery
      $.fn.modal = jest.fn();

      // DOM element creation
      const billUrl = "../assets/images/facturefreemobile.jpg";
      document.body.innerHTML = BillsUI({ data: bills });

      // Init Bills container
      let copyBills = new Bills({
        document, 
        onNavigate, 
        firestore: null, 
        localStorage: null, 
        bills: bills, 
        loading: false, 
        error: null
      })

      // Icon eye Event creation
      const icon = screen.getAllByTestId('icon-eye')[0];
      const handleClickIconEyeCopie = jest.fn(e => copyBills.handleClickIconEye(icon));
      icon.addEventListener('click', () => handleClickIconEyeCopie())
      const modalBody = document.querySelector('.modal-body');
      modalBody.innerHTML = `<img width="300" src="${billUrl}" alt="Bill" />`
    
      // Act
      userEvent.click(icon);
        
      // Assert
      expect(handleClickIconEyeCopie).toHaveBeenCalled()
      expect(screen.getByText('Justificatif')).toBeTruthy()
    })
  })

  
  // test that will verify the type of date format in the bills
  describe("When I am on Bills page and there is multiple bills", () => {
    test("Then bills should have a date format using formatDate()", async () => {
      // DOM element creation
      document.body.innerHTML = BillsUI({ data: bills })

      // mock Bills container and get bills
      const billsContainer = new Bills({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage,
      })
      
      let results = await billsContainer.getBills()
      console.log("This is results => ", results, typeof results)
        for(let result in results) { 
          console.log("This is result => ", result)
        }; 



      // date regex format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      // date array creation
      const dates = Array.from(document.body.querySelectorAll('.bill__date')).map(a => a.innerHTML)

      // Assert
      dates.map(date => dateRegex.test(date)).forEach(date => expect(date).toBeTruthy())
    })
  })



  describe("When Im on the Bills page and there is multiple bills", () => {
    test("Then bills should be ordered from earliest to latest", () => {
      // DOM element creation
      document.body.innerHTML = BillsUI({ data: bills })

      // date array creation
      const dates = Array.from(document.body.querySelectorAll('.bill__date')).map(a => a.innerHTML)

      // sort dates array
      const antiChrono = (a, b) => (b-a)
      const datesSorted = [...dates].sort(antiChrono)

      // Assert
      expect(dates).toEqual(datesSorted)
      
      // possible evolution date format
      // (/^(0[1-9]|[12]\d|3[01])\s(Jan|Fév|Mars|Avr|Mai|Juin|Juil|Août|Sept|Oct|Nov|Déc)\.\s\d\d$/i)
    })
  })

})
