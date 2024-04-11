create table student(
	SID serial primary key,
	username varchar (20),
	email varchar (50),
	password varchar (200),
	year int
);
create table events(
	EID serial primary key,
	Title varchar (50),
	Domain_t varchar(50),
	Date DATE,
	Description varchar (100),
	Seats int
)
create table alumnus(
	AID serial primary key,
	username varchar (20),
	password varchar(200),
	email varchar (50),
	experience_years int
)

create table internship(
	IID serial primary key,
	Title varchar (20),
	Roles varchar (20),
	Domain_t varchar (20),
	applicants int,
	description varchar (100),
	duration_months int,
	date DATE
)
alter table internship add column aid_fk int
alter table internship add FOREIGN KEY(aid_fk) references alumnus(AID);

create table apply(
	sid_fk int,
	iid_fk int,
	acceptance boolean,
	primary key (sid_fk,iid_fk)
)
alter table apply add FOREIGN KEY (sid_fk) references student(sid)
alter table apply add FOREIGN KEY (iid_fk) references internship(iid)

create table register(
	sid_fk int,
	eid_fk int,
	PRIMARY KEY(sid_fk,eid_fk)
)
alter table register add FOREIGN KEY (sid_fk) references student(sid)
alter table register add FOREIGN KEY (eid_fk) references events(eid)

create table manageEvents(
	sid_fk int,
	aid_fk int,
	acceptance boolean,
	primary key (sid_fk,aid_fk)
)
alter table manageEvents add FOREIGN KEY (sid_fk) references student(sid);
alter table manageEvents add FOREIGN KEY (aid_fk) references alumnus(aid);

create table student_interests(
	sid int primary key,
	AIML boolean,
	Web_Development boolean,
	Data_Science boolean,
	App_Dev boolean,
	CyberSec boolean,
	Cloud_Computing boolean,
	BlockChain boolean,
	IOT boolean
)
alter table student_interests add FOREIGN KEY(sid) references student(sid)

create table alumni_expertise(
	aid int primary key,
	AIML boolean,
	Web_Development boolean,
	Data_Science boolean,
	App_Dev boolean,
	CyberSec boolean,
	Cloud_Computing boolean,
	BlockChain boolean,
	IOT boolean
)
alter table alumni_expertise add FOREIGN KEY(aid) references alumnus(aid)