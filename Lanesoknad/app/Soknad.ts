import {Component, OnInit} from "@angular/core";
import { Injectable, Inject } from "@angular/core";
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import "rxjs/add/operator/map";
import { Lanesoknad } from "./Lanesoknad";
import { Headers } from "@angular/http";

@Component({
    selector: "min-app",
    templateUrl: "./app/Soknad.html"
})
export class Soknad {
    lanebelop: number = 10000; 
    nedbetaling: number = 5;
    rentefot: number = 0.07;
    manedsbelop: number = 0;
    skjemaStatus: string = "soknad";
    visKundeListe: boolean;
    alleSoknad: Array<Lanesoknad>; // for listen av alle kundene
    skjema: FormGroup;
    belop: FormGroup;
    belopSkjema: boolean;     
    visSkjema: boolean;
    tabellSkjema:boolean;
    laster: boolean;
    public manedsbelopet: string;
    go
        //godkjent: boolean;
    
   constructor( @Inject(Http) private _http: Http, @Inject(FormBuilder) private fb: FormBuilder) {
        this.belop = fb.group({
            lanebelop:[""],
            nedbetaling:[""],
            manedsbelop:[""]
        });

        this.skjema = fb.group({
            personnummer: ["", Validators.pattern("[0-9]{11}")],
            telefonnummer: ["", Validators.pattern("[0-9]{8,12}")],
            email: ["", Validators.pattern("[a-zA-Z0-9_]+@[a-zA-Z0-9_]+[.][a-zA-Z]{2,3}")]
        });                                                 

        this.belop.controls["lanebelop"].setValue(50000);
        this.belop.controls["nedbetaling"].setValue(5);

        this.lanebelop = 50000;
        this.nedbetaling = 5;

        this.beregneBelop();
    }
   
    ngOnInit() {
        this.laster = true;
        this.hentAlleSoknader();
        this.skjemaStatus = "soknad";
        this.belopSkjema = true;
        this.visSkjema = false;
        this.visKundeListe = false;
        this.tabellSkjema = true;
    }

    vedSubmit() {
        if (this.skjemaStatus == "belop") {
            this.belopSkjema = true;
        }
        else if (this.skjemaStatus == "soknad") {
            this.visSkjema = true;
            this.belopSkjema = false;
        }                      
        else {
            alert("Feil i applikasjonen!");
        }
    }

    calcFormel(val) {
        console.log(val);
        this.belop.controls["manedsbelop"].setValue(val);
    }

    hentAlleSoknader() {
        this._http.get("api/Soknad/")
            .map(returData => {
                let JsonData = returData.json();
                return JsonData;
            })
            .subscribe(
            JsonData => {
                this.alleSoknad = [];
                if (JsonData) {
                    for (let soknadObjekt of JsonData) {
                        this.alleSoknad.push(soknadObjekt);
                        this.laster = false;
                    }
                };
            },
            error => alert(error),
            () => console.log("ferdig get-api/Soknad")
        );
    };
     
    beregneBelop() {
        this.lanebelop = this.belop.value.lanebelop;
        //this.nedbetaling = this.belop.value.nedbetaling;

        var teller = this.rentefot * this.lanebelop;
        var nevner1 = Math.pow((1 + this.rentefot), -(this.nedbetaling));
        var nevner2 = 1 - nevner1;
        var arsbelop = (teller / nevner2);
        this.manedsbelop = (arsbelop / 12);
        this.manedsbelopet = (this.manedsbelop.toFixed(2)).toString();
    }      
    
    endreLanebelop() {
        var verdi = parseInt(this.belop.value.lanebelop);
        this.lanebelop = verdi;
        this.beregneBelop();
    }

    endreNedbetaling(value:number) {
        var verdi = parseInt(this.belop.value.nedbetaling);
        this.nedbetaling = value;
        this.beregneBelop();
    }
    
/*

    registrerSoknad() {
        // må resette verdiene i skjema dersom skjema har blitt brukt til endringer
        this.skjema.patchValue({ id: "" });
        this.skjema.patchValue({ fornavn: "" });
        this.skjema.patchValue({ etternavn: "" });
        this.skjema.patchValue({ adresse: "" });
        this.skjema.patchValue({ postnr: "" });
        this.skjema.patchValue({ poststed: "" });
        this.visKundeListe = false;
        this.skjemaStatus = "Registrere";
        this.visSkjema = true;
    }
        */

    tilbakeTilKalkulator() {
        this.belopSkjema = true;
        this.visSkjema = false;
        return false;
    } 
      
    lagreSoknad() {
        var lagretSoknad = new Lanesoknad();

        lagretSoknad.personnummer = parseInt(this.skjema.value.personnummer);
        lagretSoknad.telefonnummer = this.skjema.value.telefonnummer;
        lagretSoknad.email = this.skjema.value.email;
        lagretSoknad.lanebelop = this.lanebelop;
        lagretSoknad.ar = this.nedbetaling;
        lagretSoknad.manedsbelop = this.manedsbelop.toFixed(2);

        var body:string = JSON.stringify(lagretSoknad);
        var headers = new Headers({ "Content-Type": "application/json" });

        console.log(body);

        this._http.post("api/Soknad", body, { headers: headers })   
            .map(returData => returData.toString())
            .subscribe(
                retur=> {
                    this.skjema.patchValue({ personnummer: "" });
                    this.skjema.patchValue({ telefonnummer: "" });
                    this.skjema.patchValue({ email: "" });

                    this.hentAlleSoknader();
                    this.visSkjema = false;
                    this.belopSkjema = true;

                    alert("Søknad har blitt sendt inn!");
                },
            error => alert("Noen av feltene er tastet inn feil! Husk at personnummer må være unik."),
            () => console.log("ferdig post-api/kunde")
        );
    };
}