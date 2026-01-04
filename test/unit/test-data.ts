import {
  LegacyChangeBlock,
  LegacyOpenBlock,
  LegacyReceiveBlock,
  LegacySendBlock,
  StateBlock,
} from "../../src/nano/blocks";
import {
  AccountString,
  HashString,
  HeightBounds,
  HeightString,
  LinkString,
  NanoAmountString,
  NodeIdString,
  PrivateKeyString,
  PublicKeyString,
  PublicKeyStrings,
  RawAmountString,
  RootString,
  SeedIndex,
  SeedString,
  SignatureString,
  TimestampString,
  WorkString,
} from "../../src/nano/types";

export const TestData = {
  Valid: {
    KeySet1: () => ({
      Seed: (): SeedString => "36845C54B9CC4095BBF1345D9D3E5CC0B373CC16C85B1022CDE111947DA6AF10",
      SeedIndex: (): SeedIndex => 0,
      PrivateKey: (): PrivateKeyString => "B7DDAF5DDE0169C84A904909CC6C206B4EE32493E7B549A95900B5D2E5C78BFA",
      PublicKey: (): PublicKeyString => "BBF2EC92A246D0A2348EB0078E865D3D19C1B884693D5BFF660B7A536A03D629",
      Account: (): AccountString => "nano_3gzkxkbc6jpinataxe19jt57thasr8waatbxdhzpe4utcfo19ojbdnocoyee",
    }),

    KeySet2: () => ({
      Seed: (): SeedString => "3CAF0C88231EE610940647A646118E3312F8009DE4D0B8A9DDF82929C973048F",
      SeedIndex: (): SeedIndex => 1,
      PrivateKey: (): PrivateKeyString => "EB520D0273B8BC6520C195814DD81971AEC82A8BA882EA5324547FFF63B1C5CF",
      PublicKey: (): PublicKeyString => "2208BAEC5592623714CC5D480CC2CFB4EDC1070106262CE84112B1E7B8E1F8A6",
      Account: (): AccountString => "nano_1aiaqdp7d6m48wcerqca3m3ezf9fr65i43j87mn646ojwywg5y78oq6x38b1",
    }),

    KeySet3: () => ({
      Seed: (): SeedString => "9EBA455B92261B9366E52C84E34EDF255DA5F7CD8875652EF0C5B614692AFD37",
      SeedIndex: (): SeedIndex => 2,
      PrivateKey: (): PrivateKeyString => "CC038A2F710C6DD8E5E819F92DAD17BE256E0DF726ABC6D06EDC1F238CFBA141",
      PublicKey: (): PublicKeyString => "FBBAF14AF71A17BEB311FA1A947842A0CC1424C11B413DE4E954607648BBB576",
      Account: (): AccountString => "nano_3yxty77hg8iqqtsj5yitkjw67a8e4ike48t39qkgko51gs6dqfdpub93jssc",
    }),

    KeySet4: () => ({
      Seed: (): SeedString => "6D88BD7B2926E1418BF7A04C10824DE8863DC4D0EB9A6D6BAC518C766836E815",
      SeedIndex: (): SeedIndex => 3,
      PrivateKey: (): PrivateKeyString => "6D4C22279EF6C2034ED7E4103F5FAF9570654FA265D89AC35E50FB7A2FFEFB05",
      PublicKey: (): PublicKeyString => "8AE15E61358410A62A98BCD95D7BBF90A04B25BD9688B6803225D528358717F6",
      Account: (): AccountString => "nano_34q3dsimd31inrobjh8sdoxuz671bekuu7napt156bgo71trg7zphb8dwzmu",
    }),

    Seed1: (): SeedString => TestData.Valid.KeySet1().Seed(),
    Seed2: (): SeedString => TestData.Valid.KeySet2().Seed(),
    Seed3: (): SeedString => TestData.Valid.KeySet3().Seed(),
    Seed4: (): SeedString => TestData.Valid.KeySet4().Seed(),

    SeedIndex1: (): SeedIndex => TestData.Valid.KeySet1().SeedIndex(),
    SeedIndex2: (): SeedIndex => TestData.Valid.KeySet2().SeedIndex(),
    SeedIndex3: (): SeedIndex => TestData.Valid.KeySet3().SeedIndex(),
    SeedIndex4: (): SeedIndex => TestData.Valid.KeySet4().SeedIndex(),

    PrivateKey1: (): PrivateKeyString => TestData.Valid.KeySet1().PrivateKey(),
    PrivateKey2: (): PrivateKeyString => TestData.Valid.KeySet2().PrivateKey(),
    PrivateKey3: (): PrivateKeyString => TestData.Valid.KeySet3().PrivateKey(),
    PrivateKey4: (): PrivateKeyString => TestData.Valid.KeySet4().PrivateKey(),

    PublicKey1: (): PublicKeyString => TestData.Valid.KeySet1().PublicKey(),
    PublicKey2: (): PublicKeyString => TestData.Valid.KeySet2().PublicKey(),
    PublicKey3: (): PublicKeyString => TestData.Valid.KeySet3().PublicKey(),
    PublicKey4: (): PublicKeyString => TestData.Valid.KeySet4().PublicKey(),

    Account1: (): AccountString => TestData.Valid.KeySet1().Account(),
    Account2: (): AccountString => TestData.Valid.KeySet2().Account(),
    Account3: (): AccountString => TestData.Valid.KeySet3().Account(),
    Account4: (): AccountString => TestData.Valid.KeySet4().Account(),

    Root1: (): RootString => `${TestData.Valid.PublicKey1()}${PublicKeyStrings.zero()}`,
    Root2: (): RootString => `${TestData.Valid.PublicKey1()}${TestData.Valid.PublicKey2()}`,
    Root3: (): RootString => `${TestData.Valid.PublicKey2()}${TestData.Valid.PublicKey3()}`,
    Root4: (): RootString => `${TestData.Valid.PublicKey3()}${TestData.Valid.PublicKey4()}`,

    RawAmount1: (): RawAmountString => "1000000000000000000000000000000001",
    RawAmount2: (): RawAmountString => "9000000000000000000000000000000000000",
    RawAmount3: (): RawAmountString => "6123457789123456789123456789123456789",
    RawAmount4: (): RawAmountString => "123456789123456789123456789123456789",

    NanoAmount1: (): NanoAmountString => "1000.000000000000000000000000000001",
    NanoAmount2: (): NanoAmountString => "9000000.000000000000000000000000000000",
    NanoAmount3: (): NanoAmountString => "6123457.789123456789123456789123456789",
    NanoAmount4: (): NanoAmountString => "123456.789123456789123456789123456789",

    NodeId1: (): NodeIdString => "node_3jgm64cjcyo4z5qffeneyfkinypaimdebro697t6fc5prc6jtoy8797yyci7",
    NodeId2: (): NodeIdString => "node_1x6ot7syerwk3h6dd57h6q7gqdgu9xyf3cdfurnc9g7zffog6pa9fjj3pmm9",
    NodeId3: (): NodeIdString => "node_3riqbe6ze7h94zudnbbwtzoj14f5yuykys6gsz3bk6z6n5sh8tag1zniozqt",
    NodeId4: (): NodeIdString => "node_1m7io7iri5wr3drsxt7co67wcaqrgepiwcc4hzz3zpjo5owr6m6zwqw6e7kp",

    Representative1: (): AccountString => "nano_3jgm64cjcyo4z5qffeneyfkinypaimdebro697t6fc5prc6jtoy8797yyci7",
    Representative2: (): AccountString => "nano_1x6ot7syerwk3h6dd57h6q7gqdgu9xyf3cdfurnc9g7zffog6pa9fjj3pmm9",
    Representative3: (): AccountString => "nano_3riqbe6ze7h94zudnbbwtzoj14f5yuykys6gsz3bk6z6n5sh8tag1zniozqt",
    Representative4: (): AccountString => "nano_1m7io7iri5wr3drsxt7co67wcaqrgepiwcc4hzz3zpjo5owr6m6zwqw6e7kp",

    Link1: (): LinkString => "994FB51A40E516B8BC82299CDC71575A2F8E5ACFAB090EC963EAFE596A940E32",
    Link2: (): LinkString => "BBF2EC92A246D0A2348EB0078E865D3D19C1B884693D5BFF660B7A536A03D629",
    Link3: (): LinkString => "523F8240320ACA742BEE4A1223FFE35E5B88BFAA2D179E89AD71A5C9A3AE456C",
    Link4: (): LinkString => "0000000000000000000000000000000000000000000000000000000000000000",

    LinkAsAccount1: (): AccountString => "nano_38chpnf63sapq4ya6cewujrogpjhjsfezcrb3u6p9tqyd7oba5jkx5irysno",
    LinkAsAccount2: (): AccountString => "nano_3gzkxkbc6jpinataxe19jt57thasr8waatbxdhzpe4utcfo19ojbdnocoyee",
    LinkAsAccount3: (): AccountString => "nano_1njzib1564pcgioywkik6hzy8qkuj4ztndaqmt6ttwf7s8jtwjdew8mriuyk",
    LinkAsAccount4: (): AccountString => "nano_1111111111111111111111111111111111111111111111111111hifc8npp",

    Hash1: (): HashString => "523F8240320ACA742BEE4A1223FFE35E5B88BFAA2D179E89AD71A5C9A3AE456C",
    Hash2: (): HashString => "510E379CB673FE91DC87543E25F19199B2A30428C1C88220B048B9535F1DB760",
    Hash3: (): HashString => "C1428AFE24E4ADAAF8173C2ED7FEC6A5891FE2741EC82FFFC064EAFE4BC7AC42",
    Hash4: (): HashString => "8953CC235AB7EEE66A0CBFA69135397036F12D4120DE5FCE777DC1272173ED97",

    PrevHash1: (): HashString => "0000000000000000000000000000000000000000000000000000000000000000",
    PrevHash2: (): HashString => "2A42A5073F16683928D855B30B19AD4F337608F3B34E176FF617D1AE1D740DB5",
    PrevHash3: (): HashString => "DB9E18FD64153BD31D068F8757E53CABE8A830893256784DEAC56D41BD83DE0A",
    PrevHash4: (): HashString => "0BD8BAD318CBFBBEAAB2B6436B7F9D62F70421D21750C005A2D47443144945FF",

    Height1: (): HeightString => "0",
    Height2: (): HeightString => "1",
    Height3: (): HeightString => "9999999",
    Height4: (): HeightString => String(HeightBounds.max()),

    Work1: (): WorkString => "7b7ca1f0bf86cee4",
    Work2: (): WorkString => "1a07c248787b5740",
    Work3: (): WorkString => "901c7065f564b557",
    Work4: (): WorkString => "12fac97dbb6b10f4",

    WorkDifficulty1: (): WorkString => "fffffe0000000000",
    WorkDifficulty2: (): WorkString => "fffffff800000000",
    WorkDifficulty3: (): WorkString => "fffffff800000000",
    WorkDifficulty4: (): WorkString => "fffffff800000000",

    Signature1: (): SignatureString =>
      "6B6F2E7084758376BDDAC947E31DCFEDC055F1DA98C5DC0169AF4D5A53376BE1791C3D0C6989D19172BDFBB4DDA840C5422A49E73F8EB5E62315576E4FAD150B",
    Signature2: (): SignatureString =>
      "2757D201045564F840C4C5F516964CC92DD801F9434B8AEA70A66E45EC465958625552C5F15DB80B66AB07A05E4C5A59E9E389BEF1715FD732C0DC2A00AABC0F",
    Signature3: (): SignatureString =>
      "E2C643F491C8E863E0505FA4F7456CB28E833B87DEF6B026128EB6949A3E7AA4752A949C8EC3392885F64E04D4CDB190D07AA4F2D8803C4FAE3F83F59154FB05",
    Signature4: (): SignatureString =>
      "C23A341E5D97DC35524385B432A1C5A12114A654F58E5FE2C438DC63CD7B2342847BC7C339BF8A4B2FA8DD88151D77F5A94E2DF6A4157062833A70584244D202",

    Timestamp1: (): TimestampString => "1748782303",
    Timestamp2: (): TimestampString => "1751983737",
    Timestamp3: (): TimestampString => "1759285938",
    Timestamp4: (): TimestampString => "1764461015",

    Epoch: {
      V1: {
        Signer: {
          Account: (): AccountString => "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3",
          PublicKey: (): PublicKeyString => "E89208DD038FBB269987689621D52292AE9C35941A7484756ECCED92A65093BA",
          Link: (): LinkString => "65706F636820763120626C6F636B000000000000000000000000000000000000",
        },
        StateBlock1: (): StateBlock => ({
          type: "state",
          account: "nano_13ezf4od79h1tgj9aiu4djzcmmguendtjfuhwfukhuucboua8cpoihmh8byo",
          previous: "C7764B37F04C74CF814B19C4DC6FFD53B5E999495C8E5C0D7EA1372A57E1E9C6",
          representative: "nano_1awsn43we17c1oshdru4azeqjz9wii41dy8npubm4rg11so7dx3jtqgoeahy",
          balance: "579573579623600346831066759150",
          link: "65706F636820763120626C6F636B000000000000000000000000000000000000",
          link_as_account: "nano_1sdifxjpia5p86i86u5hefoi1111111111111111111111111111g7jhnpfy",
          signature:
            "86E106B140467B5DE749DB90C05E528C8FBB3AA1911A375BA59597636751C2FD404719300DE80AF4DBD87F456556A88FFCDAB4F6349D7ECCD2CCB4601590320D",
          work: "a368854d43d255d2",
        }),
      },
      V2: {
        Signer: {
          Account: (): AccountString => "nano_3qb6o6i1tkzr6jwr5s7eehfxwg9x6eemitdinbpi7u8bjjwsgqfj4wzser3x",
          PublicKey: (): PublicKeyString => "DD24A9200D4BF8247981E4AC63DBDE38FD2319386970A26D02ECC98C79975DB1",
          Link: (): LinkString => "65706F636820763220626C6F636B000000000000000000000000000000000000",
        },
        StateBlock1: (): StateBlock => ({
          type: "state",
          account: "nano_13ezf4od79h1tgj9aiu4djzcmmguendtjfuhwfukhuucboua8cpoihmh8byo",
          previous: "56423504169DAA0857CE60CDFEA4B9900F229DC90BBAB1AA1BFF69C52198AB54",
          representative: "nano_1awsn43we17c1oshdru4azeqjz9wii41dy8npubm4rg11so7dx3jtqgoeahy",
          balance: "579573579623600346831066759150",
          link: "65706F636820763220626C6F636B000000000000000000000000000000000000",
          link_as_account: "nano_1sdifxjpia5p8ai86u5hefoi1111111111111111111111111111ngspq7ps",
          signature:
            "5605E6F79F4BD6AEC11D72A6C2DDE9D5340A7B9E3EF95E7E519249667893602B90DBAF5EA67E845F7684E09A7D5B3B5703370AA2E4647D147529EA56194E9706",
          work: "ba6d99a7b565a0fa",
        }),
      },
    },

    StateBlock1: (): StateBlock => ({
      type: "state",
      account: TestData.Valid.Account1(),
      previous: TestData.Valid.PrevHash1(),
      representative: TestData.Valid.Representative1(),
      balance: TestData.Valid.RawAmount1(),
      link: TestData.Valid.Link1(),
      link_as_account: TestData.Valid.LinkAsAccount1(),
      signature: TestData.Valid.Signature1(),
      work: TestData.Valid.Work1(),
    }),

    StateBlock2: (): StateBlock => ({
      type: "state",
      account: TestData.Valid.Account2(),
      previous: TestData.Valid.PrevHash2(),
      representative: TestData.Valid.Representative2(),
      balance: TestData.Valid.RawAmount2(),
      link: TestData.Valid.Link2(),
      link_as_account: TestData.Valid.LinkAsAccount2(),
      signature: TestData.Valid.Signature2(),
      work: TestData.Valid.Work2(),
    }),

    StateBlock3: (): StateBlock => ({
      type: "state",
      account: TestData.Valid.Account3(),
      previous: TestData.Valid.PrevHash3(),
      representative: TestData.Valid.Representative3(),
      balance: TestData.Valid.RawAmount3(),
      link: TestData.Valid.Link3(),
      link_as_account: TestData.Valid.LinkAsAccount3(),
      signature: TestData.Valid.Signature3(),
      work: TestData.Valid.Work3(),
    }),

    StateBlock4: (): StateBlock => ({
      type: "state",
      account: TestData.Valid.Account4(),
      previous: TestData.Valid.PrevHash4(),
      representative: TestData.Valid.Representative4(),
      balance: TestData.Valid.RawAmount4(),
      link: TestData.Valid.Link4(),
      link_as_account: TestData.Valid.LinkAsAccount4(),
      signature: TestData.Valid.Signature4(),
      work: TestData.Valid.Work4(),
    }),

    LegacyChangeBlock: (): LegacyChangeBlock => ({
      type: "change",
      previous: TestData.Valid.PrevHash1(),
      representative: TestData.Valid.Representative1(),
      work: TestData.Valid.Work1(),
      signature: TestData.Valid.Signature1(),
    }),

    LegacyOpenBlock: (): LegacyOpenBlock => ({
      type: "open",
      source: TestData.Valid.Hash1(),
      representative: TestData.Valid.Representative1(),
      account: TestData.Valid.Account1(),
      work: TestData.Valid.Work1(),
      signature: TestData.Valid.Signature1(),
    }),

    LegacyReceiveBlock: (): LegacyReceiveBlock => ({
      type: "receive",
      previous: TestData.Valid.PrevHash1(),
      source: TestData.Valid.Hash1(),
      work: TestData.Valid.Work1(),
      signature: TestData.Valid.Signature1(),
    }),

    LegacySendBlock: (): LegacySendBlock => ({
      type: "send",
      previous: TestData.Valid.PrevHash1(),
      destination: TestData.Valid.Account1(),
      balance: TestData.Valid.RawAmount1(),
      work: TestData.Valid.Work1(),
      signature: TestData.Valid.Signature1(),
    }),
  },

  Invalid: {
    Seed: {
      InvalidCharacters: (): SeedString => "Z".repeat(TestData.Valid.Seed1().length),
      TooShort: (): SeedString => TestData.Valid.Seed1().slice(0, 32),
      TooLong: (): SeedString => TestData.Valid.Seed1() + "A",
    },

    PrivateKey: {
      InvalidCharacters: (): PrivateKeyString => "Z".repeat(TestData.Valid.PrivateKey1().length),
      TooLong: (): PrivateKeyString => TestData.Valid.PrivateKey1() + "A",
      TooShort: (): PrivateKeyString => TestData.Valid.PrivateKey1().slice(0, 40),
    },

    PublicKey: {
      InvalidCharacters: (): PublicKeyString => "Z".repeat(TestData.Valid.PublicKey1().length),
      TooLong: (): PublicKeyString => TestData.Valid.PublicKey1() + "A",
      TooShort: (): PublicKeyString => TestData.Valid.PublicKey1().slice(0, 40),
    },

    Account: {
      ChecksumMismatch: (): AccountString => {
        const acc = TestData.Valid.Account1();
        const last = acc[acc.length - 1];
        const flipped = last === "a" ? "b" : "a";
        return acc.slice(0, -1) + flipped;
      },
      InvalidCharacters: (): AccountString => "Z".repeat(TestData.Valid.Account1().length),
      PrefixMissing: (): AccountString => TestData.Valid.Account1().slice("nano_".length),
      PrefixWrong: (): AccountString => "abc_" + TestData.Valid.Account1().slice("nano_".length),
      TooLong: (): AccountString => TestData.Valid.Account1() + "a",
      TooShort: (): AccountString => TestData.Valid.Account1().slice(0, -4),
    },

    Root: {
      InvalidCharacters: (): RootString => "Z".repeat(TestData.Valid.Root1().length),
      TooLong: (): RootString => TestData.Valid.Root1() + "A",
      TooShort: (): RootString => TestData.Valid.Root1().slice(0, 64),
    },

    RawAmount: {
      InvalidCharacters: (): RawAmountString => "A".repeat(TestData.Valid.RawAmount1().length),
      InvalidDecimalPoint: (): RawAmountString => "1000.5001",
      Negative: (): RawAmountString => "-1",
      TooHigh: (): RawAmountString => "340282366920938463463374607431768211456",
    },

    NanoAmount: {
      InvalidCharacters: (): RawAmountString => "A".repeat(TestData.Valid.NanoAmount1().length),
      Negative: (): NanoAmountString => "-1",
      TooHigh: (): NanoAmountString => "340282366.920938463463374607431768211456",
    },

    NodeId: {
      ChecksumMismatch: (): NodeIdString => {
        const acc = TestData.Valid.NodeId1();
        const last = acc[acc.length - 1];
        const flipped = last === "a" ? "b" : "a";
        return acc.slice(0, -1) + flipped;
      },
      InvalidCharacters: (): NodeIdString => "Z".repeat(TestData.Valid.NodeId1().length),
      PrefixMissing: (): NodeIdString => TestData.Valid.NodeId1().slice("node_".length),
      PrefixWrong: (): NodeIdString => "abc_" + TestData.Valid.NodeId1().slice("node_".length),
      TooLong: (): NodeIdString => TestData.Valid.NodeId1() + "a",
      TooShort: (): NodeIdString => TestData.Valid.NodeId1().slice(0, -4),
    },

    Link: {
      InvalidCharacters: (): LinkString => "Z".repeat(TestData.Valid.Link1().length),
      TooLong: (): LinkString => TestData.Valid.Link1() + "A",
      TooShort: (): LinkString => TestData.Valid.Link1().slice(0, 40),
    },

    Hash: {
      InvalidCharacters: (): HashString => "Z".repeat(TestData.Valid.Hash1().length),
      TooLong: (): HashString => TestData.Valid.Hash1() + "A",
      TooShort: (): HashString => TestData.Valid.Hash1().slice(0, 40),
    },

    Height: {
      InvalidCharacters: (): RawAmountString => "A".repeat(TestData.Valid.Height1().length),
      InvalidDecimalPoint: (): RawAmountString => "1000.5",
      Negative: (): RawAmountString => "-1",
      TooHigh: (): RawAmountString => String(HeightBounds.max() + 1),
    },

    Work: {
      InvalidCharacters: (): WorkString => "Z".repeat(TestData.Valid.Work1().length),
      TooLong: (): WorkString => TestData.Valid.Work1() + "A",
      TooShort: (): WorkString => TestData.Valid.Work1().slice(0, 8),
    },

    WorkDifficulty: {
      InvalidCharacters: (): WorkString => "Z".repeat(TestData.Valid.WorkDifficulty1().length),
      TooLong: (): WorkString => TestData.Valid.WorkDifficulty1() + "A",
      TooShort: (): WorkString => TestData.Valid.WorkDifficulty1().slice(0, 8),
    },

    Signature: {
      InvalidCharacters: (): SignatureString => "Z".repeat(TestData.Valid.Signature1().length),
      TooLong: (): SignatureString => TestData.Valid.Signature1() + "A",
      TooShort: (): SignatureString => TestData.Valid.Signature1().slice(0, 64),
    },
  },
};
