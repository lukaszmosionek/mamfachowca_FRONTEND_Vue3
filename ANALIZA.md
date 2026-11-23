# ANALIZA APLIKACJI VUE 3 — mamfachowca_FRONTEND_Vue3

**Katalog:** `C:\laragon\www\mamfachowca_FRONTEND_Vue3`  
**Technologie:** Vue 3, Vue Router 4, Pinia, vue-i18n (en/pl/es), Tailwind CSS, Vite 5, Axios  
**Backend:** Laravel pod `http://127.0.0.1:8000` (`VITE_BACKEND_URL`)  
**Status serwera dev:** `npm run dev` uruchomiony poprawnie (Vite gotowy, port 5173)  

---

## 1. Czy strona działa poprawnie? Błędy w konsoli?

Serwer deweloperski startuje bez błędów i dostarcza szkielet SPA (`index.html` + `/src/main.ts`). Aplikacja jest SPA — вся zawartość jest renderowana po stronie klienta, więc WebFetch (które nie wykonuje JS) widzi tylko puste `<div id="app"></div>`.

**Główne ryzyko błędów w konsoli (bez uruchomionego backendu):**
- `src/App.vue:12-17` — przy starcie aplikacji wykonuje `axios.get(VITE_BACKEND_URL + '/sanctum/csrf-cookie')` oraz `api.get('/test-api')`. Przy braku backendu (port 8000 niedostępny) w konsoli pojawi się błąd `API error (/test-api)`.
- `src/services/api.ts` — wszystkie wywołania API (`/services`, `/providers`, `/appointments`, `/me`, `/favorites`, itd.) będą odrzucane (network/CORS error), co wywoła toasty typu "Fail to load services. Try again later." oraz puste stany na stronach z danymi (Home, Moje usługi, Wizyty, Ulubione, Profil).
- Strony statyczne (About, Kontakt jako formularz — wysłanie się nie powiedzie bez backendu) wyświetlą się poprawnie.

**Wniosek:** aplikacja uruchamia się technicznie, ale bez backendu większość funkcji opartych o dane nie działa i generuje błędy sieciowe w konsoli oraz toasty błędów.

---

## 2. Czy interfejs jest estetyczny i spójny?

**Plusy:**
- Spójna paleta oparta na Tailwind CSS (szare tła `bg-gray-100/800/900`, akcenty niebieskie `bg-blue-500/600`, czerwone `bg-red-500`).
- Używane komponenty bazowe: `BaseInput`, `BaseButton`, `BaseSelect`, `BaseModal` — zapewniają jednolity wygląd pól i przycisków.
- Ikony Font Awesome (`font-awesome-icon`) używane jednolicie.
- Responsywny układ strony głównej (sidebar z filtrami na desktop, siatka usług).
- Stopka z linkami, mediami społecznościowymi i wyborem języka/waluty.

**Uwagi / niekonsekwencje:**
- Przyciski `BaseButton` renderują treść z prop `name` **przed** zawartością slotu (`{{ name }}<slot />`). W większości widoków przekazywana jest tylko jedna z nich, więc nie ma duplicacji, ale jest to pułapka przy dalszym rozwoju.
- `NotFound.vue` nie korzysta z układu layoutu (brak nagłówka/stopki) i nie jest przetłumaczone — wygląda obco na tle reszty aplikacji.
- Niektóre widoki (np. `BookServiceView`, `MyServiceView`) miksują komponenty bazowe z czystym HTML (`<button class="bg-gray-300...">`, `<label>`), co zaburza spójność wizualną.
- `FavoritesView.vue:28` inicjalizuje listę jako `Array(10).fill({})` — przed załadowaniem danych renderuje 10 pustych kart `HomeTile`, co wygląda na błąd/placeholder.
- Brak jednolitego stylu komunikatów (mix `sweetalert2`, `vue3-toastify`, natywne `alert()`).

---

## 3. Brakujące tłumaczenia i18n (klucze niezdefiniowane)

**Krytyczne:** Aplikacja używa podzielonych plików w `src/locales/{en,pl,es}/*.json`, ale tłumaczenia zostały także skopiowane do nieużywanego, płaskiego pliku `pl.json` w katalogu głównym. Wiele kluczy z `pl.json` **nie zostało przeniesionych** do `src/locales/pl/`, co powoduje wyświetlanie samych kluczy zamiast tekstu (po angielsku lub jako klucz) przy języku polskim.

**Widoczne brakujące klucze (referowane w widokach, nieobecne w `src/locales/*`):**

| Widok / Komponent | Klucz | Uwaga |
|---|---|---|
| `RegisterView.vue:12` | `Client`, `Provider` | Opcje roli w select — wyświetli się klucz zamiast tłumaczenia |
| `ProfileView.vue:3` | `Profile` | Nagłówek profilu |
| `ProfileView.vue:11-13` | `FirstnameLastname`, `Email`, `Role` | Etykiety danych użytkownika |
| `ProfileView.vue:19` | `Services list` | Nagłówek listy usług |
| `MessagesView.vue:3,9,19` | `Messages`, `People you have chatted with`, `No messages yet` | Nagłówki i stany wiadomości |
| `MessagesView.vue:30,43,44` | `You`, `Message`, `Send` | Etykiety czatu |
| `MessagesView.vue:119,148` | `Message sent successfully`, `New message received:` | Toasty |
| `AppointmentView.vue:24` | `Unknown` | Tytuł fallback dla profilu w wizytach |
| `ForgotPassword.vue:5` | `Forgot Password` | Nagłówek (hardcoded key, brak tłumaczenia) |
| `ResetPassword.vue` | `New Password`, `Confirm Password`, `Reset Password` | Etykiety — w większości hardcoded po angielsku |
| `NotFound.vue` | — | Cały widok bez i18n (hardcoded po angielsku) |

**Dodatkowe problemy i18n:**
- `src/i18n.ts:12` — `const messages = localStorage.getItem('useValidationsKey') ? {} : langs`. Jeśli flaga `useValidationsKey` jest ustawiona w localStorage, **wszystkie tłumaczenia znikają** (puste `messages`) — ryzykowne, nieudokumentowane zachowanie.
- `account-en.json:6` — `"language": "Język"` — w pliku angielskim znajduje się polskie słowo.
- `bookService-pl.json:2` — `"title": "Zarezejwuj usługę"` — literówka ("Zarezejwuj" zamiast "Zarezerwuj").
- `register-pl.json:7-8` — `"Pokaż password"` / `"Ukryj password"` — mieszanka polsko-angielska.
- `ContactView.vue:50` — `Swal.fire(..., '', 'ok')` — nieprawidłowa ikona SweetAlert2 (`ok` nie istnieje; poprawne: `success`).
- `FavoritesView.vue:60` — `t('favorites.errors.loadServices')` — klucz nie istnieje (w pliku jest `loadService` w liczbie pojedynczej).
- `FavoritesView.vue:78` — `toast.error('favorites.errors.loadProviders')` — przekazywany jest surowy klucz, nie wywołanie `t()`, więc wyświetli się klucz.
- `BookServiceView.vue:110` — `t('errors.tryAgainLater')` — właściwy klucz to `other.tryAgainLater`.
- `MyServiceView.vue:148` — `t('errors.deletePhoto')` + `t('errors.tryAgainLater')` — błędne przestrzenie nazw (powinny być `myService.errors.deletePhoto` oraz `other.tryAgainLater`).
- Brak walidacji spójności kluczy między en/pl/es (np. `filtering-pl.json` nie ma klucza `inputPlaceholder`? Sprawdzone — ma; OK).

---

## 4. Elementy niekompletne / niefunkcjonalne / wymagające ulepszenia

- **Brak backendu** — bez Laravel na porcie 8000 niemal wszystkie funkcje z danymi (usługi, wizyty, ulubione, profil, wiadomości, rezerwacje, logowanie/rejestracja) nie działają i kończą się toastami błędów.
- `RegisterView.vue:14-22` — sekcja dostępności dla providera jest **zakomentowana**; pole `availability` w formularzu jest inicjalizowane, ale nie używane w UI.
- `MyServicesView.vue:5,8` — przycisk/formularz dodawania usługi (`ServiceForm`) jest **zakomentowany**; mimo to `ServiceForm.vue` jest importowany (plik istnieje).
- `ForgotPassword.vue` — input email jest zakomentowany, formularz nie działa poprawnie; brak walidacji i obsługi stanu.
- `ResetPassword.vue` — niemal vollständig hardcoded po angielsku, brak i18n, pole email jest `disabled` (nie edytowalne).
- `NotFound.vue` — brak i18n, brak linków poza "Go back home", niezalinkowany do layoutu.
- `Header.vue:43` — link wiadomości ma sztywno `userId: 1` zamiast aktualnego użytkownika.
- `AppointmentView.vue` — `formatDate` używa sztywnej lokalizacji `pl-PL` niezależnie od wybranego języka i18n.
- `FavoritesView.vue:28` — 10 pustych obiektów jako początkowa lista (puste placeholders).
- `currencyStore.rates` — stawki walut są ładowane z API; bez backendu filtrowanie/sortowanie po cenie może nie działać poprawnie.
- `Pusher/Echo` — inicializowane tylko gdy jest token (`main.ts:24-26`); w `MessagesView` jest fallback na pollowanie co 60 s, ale `VITE_PUSHER_APP_KEY` jest pusty w `.env`.

---

## 5. Czy formularze, przyciski i nawigacja działają poprawnie?

**Nawigacja:**
- Routing z `vue-router` jest poprawnie skonfigurowany (`src/router/routes.ts`, `src/router/index.ts`) z ochroną tras (`requiresAuth`, role), catch-all `NotFound` i przekierowaniami.
- Nagłówek (`Header.vue`) dynamicznie pokazuje linki w zależności od roli i stanu zalogowania (Login/Register vs Account/Messages/Wyloguj).
- Stopka zawiera linki do Home/About/MyServices/Contact oraz selektor języka.

**Formularze:**
- Walidacja jest spójna: `validators.ts` zwraca klucze i18n, a `BaseInput` je tłumaczy (`{{ $t(msg) }}`). Działa dla Login, Register, Contact, Reset Password, MyService.
- `LoginView` ma szybkie logowanie domyślnymi kontami (provider/client/admin) — wygodne do testów.
- `RegisterView` obsługuje rolę klienta/providera, pokazuje/ukrywa hasło, waliduje hasło i jego potwierdzenie.
- `ContactView` wysyła wiadomość i pokazuje `Swal` po sukcesie (z nieprawidłową ikoną `ok`).

**Przyciski:**
- `BaseButton` obsługuje stany `loading` (spinner) i `disabled` — poprawnie używane w formularzach.
- Niektóre przyciski spoza komponentu bazowego (np. `BookServiceView:46` "Wróć", `MyServicesView` akcje tabeli) używają własnych klas — mniej spójne.

**Uwaga:** Bez backendu wszystkie formularze kończą się błędem sieciowym (toast), więc nie można ich w pełni przetestować lokalnie bez API.

---

## 6. Placeholder-y, komunikaty błędów, stany ładowania

- **Stany ładowania:** obecne — `isLoading`/`isSaving` w Home, BookService, Appointment, AccountEdit, MyServices, Favorites, Profile, MyService, Messages. Spinnery (`<div class="spinner">`) i przyciski ze spinnerem (`BaseButton :loading`).
- **Komunikaty błędów:** obecne — `vue3-toastify` (`toast.error/toast.success/toast.info`), `Swal` (alerty), `errors` wyświetlane pod polami `BaseInput`, native `alert()` w kilku miejscach (Messages, Appointment).
- **Placeholder-y (inputy):** obecne w `RegisterView` (np. `"e.g. John Due"`), `HomeTile` — brak widocznego placeholdera w `BaseInput` dla Login (tylko label).
- **Puste stany:** `HomeView` ("No services match..."), `AppointmentView` ("You don't have appointments yet."), `FavoritesView` ("Nie dodałeś jeszcze żadnych ulubionych"), `MessagesView` ("No messages yet").
- **Problem:** `FavoritesView` inicjalizuje 10 pustych obiektów przed załadowaniem — wygląda na niechciany placeholder.
- **Problem:** `ForgotPassword`/`ResetPassword` nie mają spójnych komunikatów i18n.

---

## Podsumowanie i rekomendacje

1. **Uruchomić backend Laravel** (port 8000) — bez niego aplikacja jest w dużej mierze niefunkcjonalna i generuje błędy sieciowe.
2. **Przenieść brakujące tłumaczenia** z nieużywanego `pl.json` (katalog główny) do `src/locales/pl/*.json` i uzupełnić brakujące klucze (`Client`, `Provider`, `Profile`, `FirstnameLastname`, `Messages`, `Unknown`, `New Password`, `Confirm Password`, `Reset Password`, `Forgot Password` oraz cały `NotFound.vue`).
3. **Usunąć lub zabezpieczyć** flagę `useValidationsKey` w `src/i18n.ts:12`, która może wyczyścić wszystkie tłumaczenia.
4. **Poprawić błędy i18n:** literówka w `bookService-pl.json`, polskie słowo w `account-en.json`, mieszany język w `register-pl.json`, nieprawidłowe przestrzenie nazw (`errors.*` → `other.*` / `myService.errors.*`), nieprzetłumaczony klucz w `FavoritesView`, nieprzetłumaczony string w `FavoritesView:78`.
5. **Poprawić `ContactView.vue:50`** — ikona Swal `'ok'` → `'success'`.
6. **Dokończyć niekompletne elementy:** odkomentować/dokończyć `ServiceForm` i sekcję dostępności w `RegisterView`, naprawić `ForgotPassword`, przetłumaczyć `NotFound.vue` i `ResetPassword.vue`, usunąć sztywne `userId: 1` w `Header.vue`.
7. **Ujednolicić przyciski i komunikaty** — ograniczyć mix `Swal` / `toast` / `alert` i czystego HTML przy przyciskach.
8. **Dodać testy E2E/CI** potwierdzające działanie kluczowych ścieżek (logowanie, rejestracja, rezerwacja, kontakt) z uruchomionym backendu.

Plik nie modyfikuje żadnego koku źródłowego — zawiera wyłącznie raport analizy.
