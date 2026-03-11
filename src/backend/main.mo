import Time "mo:core/Time";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
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

  var records : List.List<BrokerageRecord> = List.empty<BrokerageRecord>();
  var nextId : Nat = 1;

  public shared func addRecord(
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
    let serialNumber = records.size() + 1;
    let record : BrokerageRecord = {
      id = nextId;
      serialNumber;
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
    records.add(record);
    let currentId = nextId;
    nextId += 1;
    currentId;
  };

  public shared func updateRecord(
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
    var found = false;
    var existingSerial : Nat = 0;
    let filtered = records.filter(
      func(r : BrokerageRecord) : Bool {
        if (r.id == id) {
          found := true;
          existingSerial := r.serialNumber;
          false;
        } else {
          true;
        };
      }
    );
    if (not found) {
      Runtime.trap("Record not found");
    };
    records := filtered;
    let updatedRecord : BrokerageRecord = {
      id;
      serialNumber = existingSerial;
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
    records.add(updatedRecord);
    true;
  };

  public shared func deleteRecord(id : Nat) : async Bool {
    let before = records.size();
    records := records.filter(func(r : BrokerageRecord) : Bool { r.id != id });
    if (records.size() == before) {
      Runtime.trap("Record not found");
    };
    true;
  };

  public query func getAllRecords() : async [BrokerageRecord] {
    records.toArray();
  };

  public query func getRecordCount() : async Nat {
    records.size();
  };

  public query func getNextSerialNumber() : async Nat {
    records.size() + 1;
  };
};
