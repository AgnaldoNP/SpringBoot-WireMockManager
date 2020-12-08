package agprojects.wiremock.datasource

import agprojects.wiremock.datasource.entity.StubEntity
import agprojects.wiremock.datasource.entity.StubGroupEntity
import agprojects.wiremock.springweb.controller.model.Stub
import agprojects.wiremock.springweb.controller.model.StubGroup

fun Stub.toEntity(stubGroup: StubGroupEntity): StubEntity = agprojects.wiremock.datasource.entity.StubEntity(
        id = this.id,
        name = this.name,
        stub = this.stub,
        order = this.order,
        stubGroup = stubGroup
)

fun Stub.toStubEntity(stubGroupId: Long) = agprojects.wiremock.datasource.entity.StubEntity(
        id = this.id,
        name = this.name,
        stub = this.stub,
        order = this.order,
        stubGroup = agprojects.wiremock.datasource.entity.StubGroupEntity(id = stubGroupId)
)

fun StubGroup.toEntity(): StubGroupEntity {
    val stubGroupEntity = agprojects.wiremock.datasource.entity.StubGroupEntity(
            id = this.id,
            name = this.name,
            description = this.description,
            order = this.order
    )

    val stubs = this.stubs.toEntities(stubGroupEntity)
    stubGroupEntity.stubs = stubs

    return stubGroupEntity
}

fun List<Stub>?.toEntities(stubGroupEntity: StubGroupEntity): List<StubEntity> = this?.map {
    StubEntity(
            id = it.id,
            name = it.name,
            stub = it.stub,
            order = it.order,
            stubGroup = stubGroupEntity
    )
}?.toList() ?: arrayListOf()

fun StubEntity.toStub(): Stub = Stub(
        id = this.id,
        name = this.name,
        order = this.order,
        stub = this.stub
)

fun List<StubEntity>.toStubs(): List<Stub> =
        this.map { it.toStub() }.toList()

fun StubGroupEntity.toStubGroup(): StubGroup = StubGroup(
        id = this.id,
        name = this.name,
        description = this.description,
        order = this.order,
        stubs = this.stubs.toStubs()
)

fun List<StubGroupEntity>.toStubGroups(): List<StubGroup> =
        this.map { it.toStubGroup() }.toList()
