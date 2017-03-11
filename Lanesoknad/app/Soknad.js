"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
require("rxjs/add/operator/map");
var Lanesoknad_1 = require("./Lanesoknad");
var http_2 = require("@angular/http");
var Soknad = (function () {
    //godkjent: boolean;
    function Soknad(_http, fb) {
        this._http = _http;
        this.fb = fb;
        this.lanebelop = 10000;
        this.nedbetaling = 5;
        this.rentefot = 0.07;
        this.manedsbelop = 0;
        this.skjemaStatus = "soknad";
        this.belop = fb.group({
            lanebelop: [""],
            nedbetaling: [""],
            manedsbelop: [""]
        });
        this.skjema = fb.group({
            personnummer: ["", forms_1.Validators.pattern("[0-9]{11}")],
            telefonnummer: ["", forms_1.Validators.pattern("[0-9]{8,12}")],
            email: ["", forms_1.Validators.pattern("[a-zA-Z0-9_]+@[a-zA-Z0-9_]+[.][a-zA-Z]{2,3}")]
        });
        this.belop.controls["lanebelop"].setValue(50000);
        this.belop.controls["nedbetaling"].setValue(5);
        this.lanebelop = 50000;
        this.nedbetaling = 5;
        this.beregneBelop();
    }
    Soknad.prototype.ngOnInit = function () {
        this.laster = true;
        this.hentAlleSoknader();
        this.skjemaStatus = "soknad";
        this.belopSkjema = true;
        this.visSkjema = false;
        this.visKundeListe = false;
        this.tabellSkjema = true;
    };
    Soknad.prototype.vedSubmit = function () {
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
    };
    Soknad.prototype.calcFormel = function (val) {
        console.log(val);
        this.belop.controls["manedsbelop"].setValue(val);
    };
    Soknad.prototype.hentAlleSoknader = function () {
        var _this = this;
        this._http.get("api/Soknad/")
            .map(function (returData) {
            var JsonData = returData.json();
            return JsonData;
        })
            .subscribe(function (JsonData) {
            _this.alleSoknad = [];
            if (JsonData) {
                for (var _i = 0, JsonData_1 = JsonData; _i < JsonData_1.length; _i++) {
                    var soknadObjekt = JsonData_1[_i];
                    _this.alleSoknad.push(soknadObjekt);
                    _this.laster = false;
                }
            }
            ;
        }, function (error) { return alert(error); }, function () { return console.log("ferdig get-api/Soknad"); });
    };
    ;
    Soknad.prototype.beregneBelop = function () {
        this.lanebelop = this.belop.value.lanebelop;
        //this.nedbetaling = this.belop.value.nedbetaling;
        var teller = this.rentefot * this.lanebelop;
        var nevner1 = Math.pow((1 + this.rentefot), -(this.nedbetaling));
        var nevner2 = 1 - nevner1;
        var arsbelop = (teller / nevner2);
        this.manedsbelop = (arsbelop / 12);
        this.manedsbelopet = (this.manedsbelop.toFixed(2)).toString();
    };
    Soknad.prototype.endreLanebelop = function () {
        var verdi = parseInt(this.belop.value.lanebelop);
        this.lanebelop = verdi;
        this.beregneBelop();
    };
    Soknad.prototype.endreNedbetaling = function (value) {
        var verdi = parseInt(this.belop.value.nedbetaling);
        this.nedbetaling = value;
        this.beregneBelop();
    };
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
    Soknad.prototype.tilbakeTilKalkulator = function () {
        this.belopSkjema = true;
        this.visSkjema = false;
        return false;
    };
    Soknad.prototype.lagreSoknad = function () {
        var _this = this;
        var lagretSoknad = new Lanesoknad_1.Lanesoknad();
        lagretSoknad.personnummer = parseInt(this.skjema.value.personnummer);
        lagretSoknad.telefonnummer = this.skjema.value.telefonnummer;
        lagretSoknad.email = this.skjema.value.email;
        lagretSoknad.lanebelop = this.lanebelop;
        lagretSoknad.ar = this.nedbetaling;
        lagretSoknad.manedsbelop = this.manedsbelop.toFixed(2);
        var body = JSON.stringify(lagretSoknad);
        var headers = new http_2.Headers({ "Content-Type": "application/json" });
        console.log(body);
        this._http.post("api/Soknad", body, { headers: headers })
            .map(function (returData) { return returData.toString(); })
            .subscribe(function (retur) {
            _this.skjema.patchValue({ personnummer: "" });
            _this.skjema.patchValue({ telefonnummer: "" });
            _this.skjema.patchValue({ email: "" });
            _this.hentAlleSoknader();
            _this.visSkjema = false;
            _this.belopSkjema = true;
            alert("Søknad har blitt sendt inn!");
        }, function (error) { return alert("Noen av feltene er tastet inn feil! Husk at personnummer må være unik."); }, function () { return console.log("ferdig post-api/kunde"); });
    };
    ;
    Soknad = __decorate([
        core_1.Component({
            selector: "min-app",
            templateUrl: "./app/Soknad.html"
        }),
        __param(0, core_2.Inject(http_1.Http)),
        __param(1, core_2.Inject(forms_1.FormBuilder))
    ], Soknad);
    return Soknad;
}());
exports.Soknad = Soknad;
