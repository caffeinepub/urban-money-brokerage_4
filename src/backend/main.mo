import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  public type BrokerageRecord = {
    id : Nat;
    serialNumber : Nat;
    finance : Text;
    customerName : Text;
    mcf : Text;
    product : Text;
    grossAmount : ?Float;
    netAmount : ?Float;
    loanAmount : ?Float;
    brokerageReceivedDate : ?Text;
    bankReceivedDate : ?Text;
    remark : Text;
    createdAt : Int;
  };

  let records = Map.empty<Nat, BrokerageRecord>();
  var nextId = 1;
  var nextSerialNumber = 1;

  public shared ({ caller }) func addRecord(
    finance : Text,
    customerName : Text,
    mcf : Text,
    product : Text,
    grossAmount : ?Float,
    netAmount : ?Float,
    loanAmount : ?Float,
    brokerageReceivedDate : ?Text,
    bankReceivedDate : ?Text,
    remark : Text,
  ) : async Nat {
    let record : BrokerageRecord = {
      id = nextId;
      serialNumber = nextSerialNumber;
      finance;
      customerName;
      mcf;
      product;
      grossAmount;
      netAmount;
      loanAmount;
      brokerageReceivedDate;
      bankReceivedDate;
      remark;
      createdAt = Time.now();
    };

    records.add(nextId, record);
    let currentId = nextId;
    nextId += 1;
    nextSerialNumber += 1;
    currentId;
  };

  public shared ({ caller }) func updateRecord(
    id : Nat,
    finance : Text,
    customerName : Text,
    mcf : Text,
    product : Text,
    grossAmount : ?Float,
    netAmount : ?Float,
    loanAmount : ?Float,
    brokerageReceivedDate : ?Text,
    bankReceivedDate : ?Text,
    remark : Text,
  ) : async Bool {
    switch (records.get(id)) {
      case (null) {
        Runtime.trap("Record not found with id: " # id.toText());
      };
      case (?existing) {
        let updatedRecord : BrokerageRecord = {
          existing with
          finance;
          customerName;
          mcf;
          product;
          grossAmount;
          netAmount;
          loanAmount;
          brokerageReceivedDate;
          bankReceivedDate;
          remark;
        };
        records.add(id, updatedRecord);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteRecord(id : Nat) : async Bool {
    switch (records.get(id)) {
      case (null) {
        Runtime.trap("Record not found with id: " # id.toText());
      };
      case (?_) {
        records.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getAllRecords() : async [BrokerageRecord] {
    records.values().toArray();
  };

  public query ({ caller }) func getRecordsByRemark(remark : Text) : async [BrokerageRecord] {
    records.values().toArray().filter(
      func(record) {
        Text.equal(record.remark, remark);
      }
    );
  };

  public query ({ caller }) func getRecordCount() : async Nat {
    records.size();
  };

  public query ({ caller }) func getNextSerialNumber() : async Nat {
    nextSerialNumber;
  };
};
