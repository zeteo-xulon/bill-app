/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import {handleClickIconEye} from "../containers/Bills.js";

import router from "../app/Router.js";

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


  // describe("When I am on Bills page and I click on the new bill button", () => {
  //   test("Then it should render NewBill page", () => {
  //     const html = BillsUI({ data: [] })
  //     document.body.innerHTML = html
  //     const onNavigate = (pathname) => {
  //       document.body.innerHTML = ROUTES({ pathname })
  //     }
  //     const bills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
  //     const handleClickNewBill = jest.fn(bills.handleClickNewBill)
  //     const newBillBtn = screen.getByTestId('btn-new-bill')
  //     newBillBtn.addEventListener('click', handleClickNewBill)
  //     fireEvent.click(newBillBtn)
  //     expect(handleClickNewBill).toHaveBeenCalled()
  //     expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
  //   })
  // })


  // describe("When I am on Bills page and I click on the icon eye", () => {
  //   test('handleClickIconEyeCopie should display the bill image in a modal', () => {
  //     // Arrange
  //     let copieBills = new Bills({document, onNavigate, firestore: null, localStorage: null, bills: bills, loading: false, error: null})
  //     // console.log("This is Bills => ", copieBills)
  //     const fakeBill = "../assets/images/facturefreemobile.jpg";
  //     document.body.innerHTML = BillsUI({ data: bills });
  //     const icon = screen.getAllByTestId('icon-eye')[0];
  //     const handleClickIconEyeCopie = jest.fn(e => copieBills.handleClickIconEye(icon));
  //     icon.addEventListener('click', () => handleClickIconEyeCopie())
  //     const modalBody = document.querySelector('.modal-body');
  //     let billUrl = icon.getAttribute("data-bill-url");
  //     billUrl = fakeBill;
    
  //     // Act
  //     icon.click()
        
  //     // Assert
  //     expect(handleClickIconEyeCopie).toHaveBeenCalled()
  //     expect(modalBody.innerHTML).toContain(`<img width="300" src="${billUrl}" alt="Bill" />`)
  //   })
  // })


  describe("Wheb Im on the Bills page and there is multiple bills", () => {
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = Array.from(document.body.querySelectorAll('.bill__date')).map(a => a.innerHTML)
      // to-do write expect expression that checks if the bills are ordered from earliest to latest (anti-chrono)
      // (/^(0[1-9]|[12]\d|3[01])\s(Jan|Fév|Mars|Avr|Mai|Juin|Juil|Août|Sept|Oct|Nov|Déc)\.\s\d\d$/i)
      const antiChrono = (a, b) => (b-a)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

})
