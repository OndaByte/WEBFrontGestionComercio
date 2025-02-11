class barraMain extends HTMLElement{
    constructor(){
        super();
        this.name;
    }

    static get observedAttributes(){
        return ['name'];
    }

    attributeChangedCallback(nameAttr, oldValue, newValue){
        switch(nameAttr){
            default:
            break;
        }
    }

    connectedCallback(){
        this.innerHTML = `
		<div id="layoutSidenav_nav">
            <nav class="sb-sidenav accordion sb-sidenav bg-light " id="sidenavAccordion">
                <div class="sb-sidenav-menu">
                    <div class="nav">
                        <div class="sb-sidenav-menu-heading">Principal</div>
                        <a class="nav-link link-dark" href="caja.html">
                            <div class="sb-nav-link-icon">
                            <i class="fa-solid fa-cash-register"></i>
                            </div>
                            Mostrador
                        </a>
                        <a class="nav-link link-dark" href="historial.html">
                            <div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                            Historial Caja
                        </a>
                        <a class="nav-link link-dark" href="historial-transacciones.html">
                            <div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                            Transacciones
                        </a>
                        <!--div class="sb-sidenav-menu-heading">Interface</div>
                        <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                            <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                            Layouts
                            <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                        </a>
                        <div class="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav class="sb-sidenav-menu-nested nav">
                                <a class="nav-link" href="layout-static.html">Static Navigation</a>
                                <a class="nav-link" href="layout-sidenav-light.html">Light Sidenav</a>
                            </nav>
                        </div>
                        <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                            <div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                            Pages
                            <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                        </a>
                        <div class="collapse" id="collapsePages" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                            <nav class="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseAuth" aria-expanded="false" aria-controls="pagesCollapseAuth">
                                    Authentication
                                    <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                                </a>
                                <div class="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                    <nav class="sb-sidenav-menu-nested nav">
                                        <a class="nav-link" href="login.html">Login</a>
                                        <a class="nav-link" href="register.html">Register</a>
                                        <a class="nav-link" href="password.html">Forgot Password</a>
                                    </nav>
                                </div>
                                <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseError" aria-expanded="false" aria-controls="pagesCollapseError">
                                    Error
                                    <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                                </a>
                                <div class="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                    <nav class="sb-sidenav-menu-nested nav">
                                        <a class="nav-link" href="401.html">401 Page</a>
                                        <a class="nav-link" href="404.html">404 Page</a>
                                        <a class="nav-link" href="500.html">500 Page</a>
                                    </nav>
                                </div>
                            </nav>
                        </div-->
                        <div class="sb-sidenav-menu-heading">Informacion</div>
                        <a class="nav-link link-dark" href="productos.html">
                            <div class="sb-nav-link-icon">
                            <i class="fa-solid fa-basket-shopping"></i>
                            </div>
                            Productos
                        </a>
                        <!--a class="nav-link link-dark" href="pedidos.html">
                            <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                            Pedidos
                        </a-->
                        <a class="nav-link link-dark" href="clientes.html">
                            <div class="sb-nav-link-icon"><i class="fas fa-table"></i></div>
                            Clientes
                        </a>
                    </div>
                </div>
                <div class="sb-sidenav-footer">
                    <div class="small">Sistema Ventas </div>
                    Gastronomico
                </div>
            </nav>
        </div>`;
        this.style.backgroundColor = "#26a626;";
        //this.style.fontFamily = "sans-serif";
/*
<div>
    <h1>Hola ${this.name} ${this.surname}</h1>
    <p>Esto es un párrafo</p>
</div>
*/
    }
}

window.customElements.define("barra-main", barraMain);
