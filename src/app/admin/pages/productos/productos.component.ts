import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogProductoComponent } from 'src/app/admin/component/dialog-producto/dialog-producto.component';
import { ProductosService } from '../../services/productos.service';
import { Producto } from 'src/app/models/producto.model';

import { Sitio } from 'src/app/models/sitio.model';
import { Talent } from 'src/app/models/talent.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {

  //#region VARIABLES

  public totalProductos: number = 0;
  public productos: Producto[] = [];
  public productoById: Producto[] = [];
  public byId: any;
  public productoModal = {};
  public pagina: any = 0;
  public totalProducto: any = 0;

  public est: number = 0;
  public mostrarPaginaPrev: any = 1;

  //#endregion

  //#region CONSTRUCTOR

  constructor(private productosService: ProductosService, public dialog: MatDialog) { }

  //#endregion

  //#region CARGADO PRINCIPAL

  ngOnInit(): void {

    this.productosService.cargarProducto(this.pagina)
      .subscribe(resp => {
        this.totalProductos = resp.total;
        this.est = resp.productos.length;
        this.productos = resp.productos;
        this.dataSource = new MatTableDataSource<Producto>(this.productos);
        this.totalProducto = resp.total;
        this.dataSource.paginator = this.paginator;
      })
  }

  //#endregion

  //#region BOTONES PAGINADO

  inc() {
    this.pagina += 5;
    this.mostrarPaginaPrev += 5;
    this.est += 5;

    if (this.pagina >= (this.totalProducto)) {
      this.pagina -= 5;
      this.mostrarPaginaPrev -= 5;
      this.est -= 5;
    }

    this.productosService.cargarProducto(this.pagina)
      .subscribe(resp => {
        this.totalProducto = resp.total;
        this.productos = resp.productos;
        this.dataSource = new MatTableDataSource<Producto>(this.productos);
      })
  }

  dec() {
    this.pagina -= 5;
    this.mostrarPaginaPrev -= 5;

    this.productosService.cargarProducto(this.pagina)
      .subscribe(resp => {
        this.totalProducto = resp.total;
        this.productos = resp.productos;
        this.est -= 5;
        this.dataSource = new MatTableDataSource<Producto>(this.productos);
      })
    if (this.pagina < 0) {
      this.pagina = 0;
      this.mostrarPaginaPrev = 1;
    }
  }

  //#endregion

  //#region MODAL

  openDialog(nombreProducto: string, imgPrincipal: string, descripcion: string, precioActual: string, precioAnterior: string,
    sitio: Sitio, talent: Talent, status: boolean, _id?: string): void {
    if (_id != null) {
      this.byId = _id;
      this.productosService.cargarProductoById(this.byId).subscribe(resp => {
        this.dataSource = new MatTableDataSource<Producto>(this.productos);
      })
      const dialogRef = this.dialog.open(DialogProductoComponent, {
        height: '700px',
        width: '950px',
        data: {
          NombreProducto: nombreProducto,
          ImgPrincipal: imgPrincipal,
          Descripcion: descripcion,
          PrecioActual: precioActual,
          PrecioAnterior: precioAnterior,

          Sitio: sitio,
          Talent: talent,

          Status: status,
          _id: _id

        }
      });
    }
  }

  openDialogCreate(): void {
    const dialogRef = this.dialog.open(DialogProductoComponent, {
      height: '700px',
      width: '950px',
    });
  }

  //#endregion

  //#region M??TODOS PRINCIPALES BY ID

  obtenerById(_id: any): void {
    this.byId = _id;
    this.productosService.cargarProductoById(this.byId)
      .subscribe(resp => {
        this.dataSource = new MatTableDataSource<Producto>(this.productos);
      })
  }

  BorrarId(_id: any) {

    Swal.fire({
      title: 'Seguro que desea eliminar?',
      text: 'Se eliminar?? el registro.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'S??, borralo!',
      cancelButtonText: 'No!',
    }).then((result) => {

      if (result.value) {
        Swal.fire(
          'Borrado',
          'Tu registro se ha eliminado.',
          'success',
        )

        if (result.isConfirmed) {
          this.productosService.borrarProducto(_id).subscribe(resp => {
            this.dataSource = new MatTableDataSource<Producto>(this.productos);
          })
          setTimeout(function () {
            window.location.reload()
          }, 1000)
        }

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Tu registro est?? seguro',
          'error'
        )
      }
    })

  }

  //#endregion

  //#region FORMATO TABLA DIN??MICA

  displayedColumns: string[] = ['nombreProducto', 'precioActual', 'precioAnterior', 'status', 'acciones'];
  dataSource = new MatTableDataSource<Producto>(ELEMENT_DATA);

  columnas = [    
    { titulo: "Producto", name: "nombreProducto" },
    { titulo: "Precio Actual", name: "precioActual" },
    { titulo: "Precio Anterior", name: "precioAnterior" },
    { titulo: "Status", name: "status" },

    { titulo: "Acciones", name: "acciones" },
  ];

  //#endregion

  //#region FILTRADO POR TEXTO

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //#endregion

}

//#region ELEMENT_DATA

const ELEMENT_DATA: Producto[] = [
  //Se tiene que enviar sin datos.
];

//#endregion
