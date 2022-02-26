import {
  PoolCreation
} from "../../generated/PoolFactory/PoolFactory"
import { Factory, Pool } from "../../generated/schema"
import { MetaversepadTemplate } from "../../generated/templates"
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { FundPool } from "../../generated/templates/MetaversepadTemplate/Metaversepad";

export function addRaisedFundToFactory(address: Address, newValue: BigInt): void {
  let id = address.toHex()
  let factory = Factory.load(id)
  if (factory == null) {
    factory = new Factory(id)
  }
  factory.totalRaised = factory.totalRaised.plus(newValue)
  factory.save()
}

export function handlePoolCreation(event: PoolCreation, evtFundPool: FundPool): void {
  // let factoryEntity = Factory.load(event.address.toHex())
  let poolEntity = Pool.load(event.params.poolAddress.toHex())

  // if (!factoryEntity) {
  //   factoryEntity = new Factory(event.address.toHex())
  // }

  if (!poolEntity) {
    poolEntity = new Pool(event.params.poolAddress.toHex())
  }

  // poolEntity.factory = event.address.toHex()
  poolEntity.maxCap = event.params.poolMaxCap
  poolEntity.createdAt = event.params.timestamp
  poolEntity.startedAt = event.params.saleStartTime
  poolEntity.endedAt = event.params.saleEndTime
  poolEntity.tiers = event.params.noOfTiers
  poolEntity.participants = event.params.totalParticipants
  poolEntity.totalRaised = BigInt.fromI32(0)

  addRaisedFundToFactory(event.address, evtFundPool.params.value)

  // factoryEntity.totalRaised = factoryEntity.totalRaised.plus(poolEntity.totalRaised)
  // factoryEntity.pool = [poolEntity.id]

  MetaversepadTemplate.create(event.params.poolAddress)

  // factoryEntity.save()
  poolEntity.save()
}