import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../../services/alert.service";
import { ImportPlayer } from "../../../models/game.model";
import { ActivatedRoute } from "@angular/router";
import {GameService} from "../../../services/game.service";

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.scss']
})
export class ImportCsvComponent implements OnInit {

  gameId!: string;
  players: ImportPlayer[] = [];
  isFileSelected: boolean = false;

  constructor(public alertService: AlertService,
              private route: ActivatedRoute,
              private gameService: GameService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('gameId')!;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        this.parseCSVData(reader.result as string);
      };
      reader.onerror = (error) => {
        this.alertService.error('Erreur de lecture du fichier');
      };
      this.isFileSelected = true; // File selected
    }
  }

  parseCSVData(csvData: string) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    if (headers.length !== 2 || headers[0] !== 'first_name' || headers[1] !== 'last_name') {
      this.alertService.error('Le fichier CSV est mal formaté');
      this.isFileSelected = false;
      return;
    }

    this.players = [];

    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(',');
      if (data.length === 2) {
        const player: ImportPlayer = {
          first_name: data[0].trim(),
          last_name: data[1].trim(),
        };
        this.players.push(player);
      }
    }

    if (this.players.length === 0) {
      this.alertService.error('Le fichier CSV est mal formaté ou ne contient pas de données');
      this.isFileSelected = false;
      return;
    }
  }


  uploadFile(fileInput: HTMLInputElement) {
    if (!this.isFileSelected) {
      this.alertService.error('Veuillez sélectionner un fichier valide avant d\'appuyer sur le bouton.');
      fileInput.value = '';
      return;
    }

    console.log(this.players);
    this.gameService.importPlayers(this.gameId, this.players).subscribe(
      (res) => {
        this.alertService.success(res.message);
        this.players = [];
      },
      (err) => {
        this.alertService.error(err.error.message);
      }
    );

    fileInput.value = '';
    this.isFileSelected = false;
  }
}
