import {prisma} from "../../utils/prisma";
import {InterventionStatus} from "@prisma/client";

const main = async () => {
    const changedIntervention = await prisma.intervention.updateMany({
        where: {
            status: InterventionStatus.PLANNED,
            providerOccupation: {
                startDate: {lte: new Date()},
                endDate: {gte: new Date()},

            }
        },
        data: {
            status: InterventionStatus.IN_PROGRESS,
        }
    })
    const endIntervention = await prisma.intervention.updateMany({
        where: {
            status: InterventionStatus.IN_PROGRESS,
            providerOccupation: {
                endDate: {lte: new Date()}
            }
        },
        data: {
            status: InterventionStatus.COMPLETED,
        }
    })
    console.log(changedIntervention)
}

main().then()