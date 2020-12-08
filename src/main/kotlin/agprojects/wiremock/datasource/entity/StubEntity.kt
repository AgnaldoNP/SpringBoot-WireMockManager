package agprojects.wiremock.datasource.entity

import javax.persistence.*

@Entity(name = "Stub")
@Table(name = "Stub")
class StubEntity(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long = 0,

        @Column
        var name: String,

        @Column
        val description: String? = "",

        @Lob
        @Column
        var stub: String,

        @Column(name = "`order`")
        val order: Int = 0,

        @ManyToOne(fetch = FetchType.EAGER)
        var stubGroup: StubGroupEntity
)
