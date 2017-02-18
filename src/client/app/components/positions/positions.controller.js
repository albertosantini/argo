export class PositionsController {
    constructor(PositionsService) {
        this.PositionsService = PositionsService;
    }

    $onInit() {
        this.PositionsService.getPositions().then(positions => {
            this.positions = positions;
        });
    }
}
PositionsController.$inject = ["PositionsService"];
